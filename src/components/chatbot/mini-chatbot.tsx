"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function MiniChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Bonjour ! Je suis l'assistant Profpoto. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get bot response
      const botResponse = await getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Get response using OpenAI API
  const getBotResponse = async (input: string): Promise<string> => {
    // For now, we'll use the hardcoded responses
    // In a production environment, this would call the OpenAI API
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("bonjour") || lowerInput.includes("salut") || lowerInput.includes("hello")) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    } else if (lowerInput.includes("tarif") || lowerInput.includes("prix") || lowerInput.includes("coût") || lowerInput.includes("abonnement")) {
      return "Nous proposons plusieurs formules d'abonnement : un essai gratuit, une formule Standard à 150€/mois (4 sessions avec un professeur) et une formule Premium à 175€/mois (6 sessions avec un professeur). Vous pouvez consulter tous les détails sur notre page Tarifs.";
    } else if (lowerInput.includes("professeur") || lowerInput.includes("prof") || lowerInput.includes("enseignant")) {
      return "Nos professeurs sont tous diplômés et expérimentés dans l'enseignement des mathématiques. Vous pouvez réserver une session avec un professeur directement depuis votre espace personnel.";
    } else if (lowerInput.includes("rendez-vous") || lowerInput.includes("réserver") || lowerInput.includes("session")) {
      return "Pour réserver une session avec un professeur, connectez-vous à votre compte et accédez à la section 'Sessions'. Vous pourrez y choisir un créneau qui vous convient.";
    } else if (lowerInput.includes("contact") || lowerInput.includes("téléphone") || lowerInput.includes("email")) {
      return "Vous pouvez nous contacter par téléphone au +33755135534 ou par email à contact@profpoto.com. Nous sommes disponibles du lundi au vendredi de 9h à 18h.";
    } else if (lowerInput.includes("inscription") || lowerInput.includes("créer un compte") || lowerInput.includes("s'inscrire")) {
      return "Pour vous inscrire, cliquez sur le bouton 'Commencer gratuitement' en haut de la page. Vous pourrez créer un compte en quelques étapes simples.";
    } else if (lowerInput.includes("merci")) {
      return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
    } else {
      return "Je ne suis pas sûr de comprendre votre question. Pourriez-vous la reformuler ? Vous pouvez aussi me demander des informations sur nos tarifs, nos professeurs, ou comment réserver une session.";
    }
    
    // In a production environment, this would be implemented:
    /*
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          history: messages.filter(m => m.id !== "welcome").map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat API error:', error);
      return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard ou contacter notre équipe de support.";
    }
    */
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen ? "bg-red-500 rotate-90" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-semibold">Assistant Profpoto</h3>
            <p className="text-xs text-blue-100">Posez vos questions sur nos services</p>
          </div>

          {/* Chat messages */}
          <div className="p-4 h-80 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Tapez votre message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Button
                type="submit"
                className="bg-blue-600 text-white rounded-r-md px-4 hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Connecté à l&apos;assistant Profpoto
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
