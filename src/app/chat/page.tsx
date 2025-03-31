"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// Types pour les messages
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantId] = useState<string | null>(process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID || "asst_oY2pG17iEKi3g7kkuQuJRGXj"); // ID de l'assistant OpenAI
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");

  // Charger les conversations de l'utilisateur
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        const conversationsQuery = query(
          collection(db, "conversations"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        
        const querySnapshot = await getDocs(conversationsQuery);
        const conversationsData: Conversation[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          conversationsData.push({
            id: doc.id,
            title: data.title || "Nouvelle conversation",
            lastMessage: data.lastMessage || "",
            timestamp: data.timestamp?.toDate() || new Date(),
          });
        });
        
        setConversations(conversationsData);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
      }
    };
    
    loadConversations();
  }, [user]);

  // Charger le document spécifié dans l'URL si présent
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId || !user) return;
      
      try {
        const docRef = doc(db, "documents", documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Créer une nouvelle conversation avec le document
          const newConversationRef = await addDoc(collection(db, "conversations"), {
            userId: user.uid,
            title: `Document: ${data.fileName || "Sans titre"}`,
            documentId: documentId,
            timestamp: serverTimestamp(),
          });
          
          setCurrentConversationId(newConversationRef.id);
          
          // Ajouter un message initial de l'assistant
          const initialMessage: Message = {
            id: "initial",
            role: "assistant",
            content: `Bonjour ! Je suis l'assistant IA de Profpoto. Je vois que vous avez ouvert un document "${data.fileName || "Sans titre"}". Comment puis-je vous aider avec ce document ?`,
            timestamp: new Date(),
          };
          
          setMessages([initialMessage]);
          
          // Ajouter le message à Firestore
          await addDoc(collection(db, "messages"), {
            conversationId: newConversationRef.id,
            role: "assistant",
            content: initialMessage.content,
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du document:", error);
      }
    };
    
    loadDocument();
  }, [documentId, user]);

  // Créer une nouvelle conversation si nécessaire
  useEffect(() => {
    const createNewConversation = async () => {
      if (!user || currentConversationId || documentId) return;
      
      try {
        // Créer une nouvelle conversation dans Firestore
        const newConversationRef = await addDoc(collection(db, "conversations"), {
          userId: user.uid,
          title: "Nouvelle conversation",
          timestamp: serverTimestamp(),
          threadId: null, // Sera mis à jour après la création du thread
        });
        
        setCurrentConversationId(newConversationRef.id);
        
        // Ajouter un message initial de l'assistant
        const initialMessage: Message = {
          id: "initial",
          role: "assistant",
          content: "Comment puis-je vous aider ?",
          timestamp: new Date(),
        };
        
        setMessages([initialMessage]);
        
        // Ajouter le message à Firestore
        await addDoc(collection(db, "messages"), {
          conversationId: newConversationRef.id,
          role: "assistant",
          content: initialMessage.content,
          timestamp: serverTimestamp(),
          openaiMessageId: null, // Pas d'ID OpenAI pour ce message initial
        });
      } catch (error) {
        console.error("Erreur lors de la création d'une nouvelle conversation:", error);
      }
    };
    
    createNewConversation();
  }, [user, currentConversationId, documentId]);

  // Charger les messages d'une conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) return;
      
      try {
        const messagesQuery = query(
          collection(db, "messages"),
          where("conversationId", "==", currentConversationId),
          orderBy("timestamp", "asc")
        );
        
        const querySnapshot = await getDocs(messagesQuery);
        const messagesData: Message[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
            id: doc.id,
            role: data.role,
            content: data.content,
            timestamp: data.timestamp?.toDate() || new Date(),
          });
        });
        
        if (messagesData.length > 0) {
          setMessages(messagesData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
      }
    };
    
    loadMessages();
  }, [currentConversationId]);

  // Faire défiler vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fonction pour traiter la réponse de l'assistant
  const handleAssistantResponse = async (result: { threadId?: string; message: string; messageId?: string }, userMessage: Message) => {
    try {
      // Stocker l'ID du thread si c'est la première interaction
      if (!threadId && result.threadId) {
        console.log("Mise à jour de l'ID du thread:", result.threadId);
        setThreadId(result.threadId);
        
        // Mettre à jour la conversation avec l'ID du thread
        if (currentConversationId) {
          const conversationRef = doc(db, "conversations", currentConversationId);
          await updateDoc(conversationRef, {
            threadId: result.threadId,
          });
        }
      }
      
      // Ajouter la réponse de l'IA
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.message,
        timestamp: new Date(),
      };
      
      console.log("Ajout de la réponse de l'assistant:", assistantMessage);
      setMessages((prev) => {
        // Filtrer le message "Je réfléchis..."
        const filteredMessages = prev.filter(msg => msg.content !== "Je réfléchis...");
        return [...filteredMessages, assistantMessage];
      });
      
      // Ajouter le message à Firestore
      if (currentConversationId) {
        await addDoc(collection(db, "messages"), {
          conversationId: currentConversationId,
          role: "assistant",
          content: assistantMessage.content,
          timestamp: serverTimestamp(),
          openaiMessageId: result.messageId,
        });
        
        // Mettre à jour le titre de la conversation si c'est la première interaction
        if (messages.length <= 1) {
          // Extraire un titre à partir du premier message de l'utilisateur
          const title = userMessage.content.length > 30
            ? userMessage.content.substring(0, 30) + "..."
            : userMessage.content;
          
          // Mettre à jour le document de conversation
          const conversationRef = doc(db, "conversations", currentConversationId);
          await updateDoc(conversationRef, {
            title: title,
            lastMessage: assistantMessage.content,
            lastUpdated: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la réponse:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Envoyer un message
  const sendMessage = async () => {
    // Ajouter des logs pour le débogage
    console.log("sendMessage appelé");
    console.log("inputValue:", inputValue);
    console.log("user:", user);
    console.log("currentConversationId:", currentConversationId);
    console.log("assistantId:", assistantId);
    
    // Vérifier si les conditions sont remplies
    if (!inputValue.trim()) {
      console.log("inputValue est vide, abandon");
      return;
    }
    
    // Mode test : permettre l'envoi même sans authentification
    const testMode = !user || !currentConversationId;
    if (testMode) {
      console.log("Mode test activé (utilisateur non authentifié ou conversation non créée)");
    }
    
    try {
      setIsLoading(true);
      
      // Ajouter le message de l'utilisateur
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: inputValue,
        timestamp: new Date(),
      };
      
      console.log("Ajout du message utilisateur:", userMessage);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      
      // Ajouter le message à Firestore (seulement si l'utilisateur est authentifié)
      if (user && currentConversationId) {
        try {
          await addDoc(collection(db, "messages"), {
            conversationId: currentConversationId,
            role: "user",
            content: userMessage.content,
            timestamp: serverTimestamp(),
            openaiMessageId: null, // Sera mis à jour après l'appel à l'API
          });
          console.log("Message utilisateur ajouté à Firestore");
        } catch (firestoreError) {
          console.error("Erreur lors de l'ajout du message à Firestore:", firestoreError);
        }
      } else {
        console.log("Utilisateur non connecté ou pas de conversation, skip Firestore");
      }
      
      // Ajouter un message temporaire "Je réfléchis..."
      const thinkingMessage: Message = {
        id: `thinking-${Date.now()}`,
        role: "assistant",
        content: "Je réfléchis...",
        timestamp: new Date(),
      };
      
      console.log("Ajout du message 'Je réfléchis...'");
      setMessages((prev) => [...prev, thinkingMessage]);
      
      // Même en mode test, utiliser l'API OpenAI
      console.log("Utilisation de l'API OpenAI avec l'ID d'assistant:", assistantId);
      
      // Appeler l'API Assistants d'OpenAI
      console.log("Appel de l'API assistant");
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: threadId,
          assistantId: assistantId,
          message: userMessage.content,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API assistant:", errorData);
        
        // Remplacer le message "Je réfléchis..." par un message d'erreur
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `Désolé, une erreur s'est produite. Veuillez réessayer plus tard. (${errorData.message || response.statusText})`,
          timestamp: new Date(),
        };
        
        setMessages((prev) => {
          // Filtrer le message "Je réfléchis..."
          const filteredMessages = prev.filter(msg => msg.content !== "Je réfléchis...");
          return [...filteredMessages, errorMessage];
        });
        
        // Ajouter le message d'erreur à Firestore
        if (user && currentConversationId) {
          await addDoc(collection(db, "messages"), {
            conversationId: currentConversationId,
            role: "assistant",
            content: errorMessage.content,
            timestamp: serverTimestamp(),
            openaiMessageId: null,
          });
        }
        
        setIsLoading(false);
        return;
      }
      
      const result = await response.json();
      console.log("Réponse de l'API reçue:", result);
      
      // Traiter la réponse
      handleAssistantResponse(result, userMessage);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setIsLoading(false);
      
      // Ajouter un message d'erreur
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Désolé, une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => {
        // Filtrer le message "Je réfléchis..."
        const filteredMessages = prev.filter(msg => msg.content !== "Je réfléchis...");
        return [...filteredMessages, errorMessage];
      });
      
      // Ajouter le message d'erreur à Firestore
      if (user && currentConversationId) {
        await addDoc(collection(db, "messages"), {
          conversationId: currentConversationId,
          role: "assistant",
          content: errorMessage.content,
          timestamp: serverTimestamp(),
          openaiMessageId: null,
        });
      }
    }
  };

  // Créer une nouvelle conversation
  const createNewChat = async () => {
    if (!user) return;
    
    try {
      // Réinitialiser l'ID du thread
      setThreadId(null);
      
      // Créer une nouvelle conversation dans Firestore
      const newConversationRef = await addDoc(collection(db, "conversations"), {
        userId: user.uid,
        title: "Nouvelle conversation",
        timestamp: serverTimestamp(),
        threadId: null, // Sera mis à jour après la création du thread
      });
      
      setCurrentConversationId(newConversationRef.id);
      
      // Ajouter un message initial de l'assistant
      const initialMessage: Message = {
        id: "initial",
        role: "assistant",
        content: "Comment puis-je vous aider ?",
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
      
      // Ajouter le message à Firestore
      await addDoc(collection(db, "messages"), {
        conversationId: newConversationRef.id,
        role: "assistant",
        content: initialMessage.content,
        timestamp: serverTimestamp(),
        openaiMessageId: null, // Pas d'ID OpenAI pour ce message initial
      });
    } catch (error) {
      console.error("Erreur lors de la création d'une nouvelle conversation:", error);
    }
  };

  // Charger une conversation existante
  const loadConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    
    try {
      // Récupérer les données de la conversation
      const conversationDoc = await getDoc(doc(db, "conversations", conversationId));
      
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data();
        
        // Récupérer l'ID du thread s'il existe
        if (conversationData.threadId) {
          setThreadId(conversationData.threadId);
        } else {
          setThreadId(null);
        }
      }
      
      // Récupérer les messages de la conversation
      const messagesQuery = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("timestamp", "asc")
      );
      
      const querySnapshot = await getDocs(messagesQuery);
      const messagesData: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      
      setMessages(messagesData);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  // Formater la date
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return "Aujourd'hui";
    } else if (date >= yesterday) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Chat History Sidebar */}
          <div className="hidden lg:flex flex-col h-full bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="mb-4">
              <Button 
                className="w-full justify-start text-left bg-white hover:bg-gray-100"
                onClick={createNewChat}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Nouvelle conversation
              </Button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-2">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                      currentConversationId === conversation.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => loadConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-grow truncate">
                        <div className="font-medium text-sm truncate text-gray-800">{conversation.title}</div>
                        <div className="text-xs text-gray-500 truncate">{formatDate(conversation.timestamp)}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    Aucune conversation récente
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Chat Main Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {/* Page Title */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Chat avec l&apos;IA</h1>
            </div>
            
            <Card className="flex-grow flex flex-col overflow-hidden border border-gray-200">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full p-4">
                  <h2 className="text-2xl font-semibold text-center">Comment puis-je vous aider ?</h2>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto p-4 space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                        </div>
                      )}
                      
                      <div 
                        className={`rounded-lg p-4 max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.content === "Je réfléchis..." ? (
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-grow relative">
                    <Input 
                      placeholder="Posez votre question ici..." 
                      className="w-full pr-10 focus:border-blue-500"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          console.log("Touche Entrée détectée");
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      console.log("Bouton d'envoi cliqué");
                      sendMessage();
                    }}
                    disabled={isLoading || !inputValue.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ProfPoto AI peut faire des erreurs. Vérifiez les informations importantes.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
