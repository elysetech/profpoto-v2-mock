/**
 * Slack notification service
 * 
 * This service handles sending notifications to Slack channels
 * using Slack's Incoming Webhooks.
 */

// Types for different notification events
type NotificationType = 
  | 'new_user'
  | 'new_session'
  | 'payment'
  | 'kyc_submission'
  | 'support_request'
  | 'new_document';

interface NotificationData {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Send a notification to Slack
 * 
 * @param type The type of notification
 * @param data The data to include in the notification
 * @returns Promise that resolves when the notification is sent
 */
export async function sendSlackNotification(
  type: NotificationType,
  data: NotificationData
): Promise<boolean> {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL is not defined');
      return false;
    }
    
    // Format the message based on the notification type
    const message = formatSlackMessage(type, data);
    
    // Send the message to Slack
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send Slack notification: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}

/**
 * Format a Slack message based on the notification type
 * 
 * @param type The type of notification
 * @param data The data to include in the notification
 * @returns Formatted Slack message
 */
interface SlackMessage {
  username: string;
  icon_emoji: string;
  text?: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
    elements?: Array<{
      type: string;
      text?: {
        type: string;
        text: string;
        emoji?: boolean;
      };
      value?: string;
      url?: string;
    }>;
  }>;
}

function formatSlackMessage(type: NotificationType, data: NotificationData): SlackMessage {
  const baseMessage = {
    username: 'Profpoto Bot',
    icon_emoji: ':robot_face:',
  };
  
  switch (type) {
    case 'new_user':
      return {
        ...baseMessage,
        text: '🎉 Nouvel utilisateur inscrit !',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎉 Nouvel utilisateur inscrit !',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Nom:* ${data.firstName} ${data.lastName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Email:* ${data.email}`,
              },
              {
                type: 'mrkdwn',
                text: `*Date:* ${new Date().toLocaleString('fr-FR')}`,
              },
            ],
          },
        ],
      };
      
    case 'new_session':
      return {
        ...baseMessage,
        text: '📚 Nouvelle session réservée !',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📚 Nouvelle session réservée !',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Élève:* ${data.studentName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Professeur:* ${data.teacherName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Date:* ${data.sessionDate}`,
              },
              {
                type: 'mrkdwn',
                text: `*Durée:* ${data.duration} minutes`,
              },
            ],
          },
        ],
      };
      
    case 'payment':
      return {
        ...baseMessage,
        text: '💰 Nouveau paiement reçu !',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '💰 Nouveau paiement reçu !',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Client:* ${data.customerName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Montant:* ${data.amount}€`,
              },
              {
                type: 'mrkdwn',
                text: `*Formule:* ${data.plan}`,
              },
              {
                type: 'mrkdwn',
                text: `*Date:* ${new Date().toLocaleString('fr-FR')}`,
              },
            ],
          },
        ],
      };
      
    case 'kyc_submission':
      return {
        ...baseMessage,
        text: '🔐 Nouvelle soumission KYC !',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🔐 Nouvelle soumission KYC !',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Utilisateur:* ${data.userName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Email:* ${data.email}`,
              },
              {
                type: 'mrkdwn',
                text: `*Type de document:* ${data.documentType}`,
              },
              {
                type: 'mrkdwn',
                text: `*Date:* ${new Date().toLocaleString('fr-FR')}`,
              },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Voir les détails',
                  emoji: true,
                },
                value: `kyc_${data.userId}`,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/kyc/${data.userId}`,
              },
            ],
          },
        ],
      };
      
    case 'support_request':
      return {
        ...baseMessage,
        text: '❓ Nouvelle demande de support !',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '❓ Nouvelle demande de support !',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*De:* ${data.name}`,
              },
              {
                type: 'mrkdwn',
                text: `*Email:* ${data.email}`,
              },
              {
                type: 'mrkdwn',
                text: `*Sujet:* ${data.subject}`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${data.message}`,
            },
          },
        ],
      };
      
    case 'new_document':
      return {
        ...baseMessage,
        text: '📄 Nouveau document importé !',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📄 Nouveau document importé !',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Utilisateur:* ${data.userName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Type de document:* ${data.documentType}`,
              },
              {
                type: 'mrkdwn',
                text: `*Format:* ${data.fileType}`,
              },
              {
                type: 'mrkdwn',
                text: `*Date:* ${new Date().toLocaleString('fr-FR')}`,
              },
            ],
          },
        ],
      };
      
    default:
      return {
        ...baseMessage,
        text: 'Notification de Profpoto',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Notification: ${JSON.stringify(data)}`,
            },
          },
        ],
      };
  }
}
