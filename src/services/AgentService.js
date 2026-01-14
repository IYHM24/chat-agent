import { getGlobalVariable } from "../config/variables.js";
import getPrompt from "../Agent/prompt.js";
import { httpService } from "../config/fetch.js";

class AgentService {
    
    constructor() {
        this.agentName = getGlobalVariable('agentName') || 'Armando';
        // No llamar configChat aquí para evitar dependencia circular
    }

    configChat = async () => {
    
        // Inicializar los mensajes del chat con el mensaje del sistema
        this.messages = [];

        // Obtener el prompt del agente
        const promptContent = getPrompt(this.agentName);

        // Añadir el mensaje del sistema al chat
        const systemMessage = {
            role: 'system',
            content: promptContent
        };
        this.messages.push(systemMessage);

        // Enviar el mensaje al agente
        const response = await this.generateAgentResponse(this.messages);
        this.setMessages(response);

        return this.messages;
    }

    /**
     * Establecer mensajes del chat
     * @param {Array []} messages 
     */
    setMessages = (messages) =>{
        this.messages = messages;
    }

    /***
     * Obtener mensajes del chat
     * @returns {Array []} messages
     */
    getMessages = () =>{
        return this.messages;
    }

    /**
     * Añadir mensaje al chat
     * @param {Object} message 
     */
    addMessage = (message) =>{
        this.messages.push(message);
    }

    /**
     * Añadir mensaje y retornar todos los mensajes
     * @param {Object} message 
     * @returns {Array []} messages
     */
    addMessageAndReturn = (message) =>{
        this.messages.push(message);
        return this.messages;
    }

    /**
     * Pregunta al agente
     * @param {Array} Message 
     * @returns {Array} Message 
     */
    generateAgentResponse = async (Message) => {
        const response = await httpService.post('/agent/ask', Message );
        return response.data.data;
    }

    run = () => {
        console.log("✅ Agente conectado");
    }
}

export default new AgentService();