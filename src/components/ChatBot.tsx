'use client';
import { useState, useEffect, useRef } from 'react';

type MessageType = 'user' | 'bot';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial bot greeting
  useEffect(() => {
    // Fetch API key from your environment variables or configuration
    // In a real implementation, you should handle this securely through a backend
    setApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBR7nikmPliqLQ62jAIz94FwjkPNTsHf88');
    
    const initialMessage: Message = {
      id: 'initial',
      content: 'Halo! Saya asisten SikaCling, siap membantu Anda dengan informasi seputar layanan cuci sepatu kami. Apa yang ingin Anda tanyakan?',
      type: 'bot',
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: generateUniqueId(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get response from Gemini API
      const response = await getGeminiResponse(inputValue);
      
      // Add bot response
      const botMessage: Message = {
        id: generateUniqueId(),
        content: response,
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: generateUniqueId(),
        content: 'Maaf, saya sedang mengalami kendala teknis. Silakan hubungi tim kami melalui WhatsApp di +62 812 3456 7890 untuk bantuan langsung.',
        type: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getGeminiResponse = async (query: string): Promise<string> => {
    // If no API key, fall back to local response
    if (!apiKey) {
      return getFallbackResponse(query);
    }

    try {
      // Updated Gemini API call for version 2.0
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Kamu adalah asisten chatbot untuk SikaCling, jasa cuci sepatu premium. Tolong jawab pertanyaan berikut terkait dengan layanan SikaCling. Berikan jawaban singkat dan fokus hanya pada produk dan layanan SikaCling.

Produk dan layanan SikaCling:
1. Cuci Dasar (Rp25.000): Pembersihan dasar bagian luar sepatu, waktu pengerjaan 3 hari.
2. Cuci Premium (Rp50.000): Pembersihan menyeluruh luar dalam termasuk deodorisasi, waktu pengerjaan 1 hari.
3. Repaint & Restoration (Rp150.000): Perbaikan warna dan kondisi sepatu seperti baru, waktu pengerjaan 1 bulan.
4. Pickup & Delivery: Layanan jemput dan antar sepatu ke alamat pelanggan, biaya bervariasi tergantung lokasi.
5. Jenis sepatu yang ditangani: sneakers, sepatu kanvas, sepatu kulit, sepatu suede, dan sepatu atletik.
6. Metode pembayaran: transfer bank, e-wallet (GoPay, OVO, DANA, LinkAja), dan pembayaran tunai.
7. Jam operasional: Setiap hari, 08:00 - 20:00 WIB.
8. Tracking: Pelanggan dapat melacak status pesanan via website dengan memasukkan nomor order.
9. Lokasi: Jl. Contoh No. 123, Jakarta. Melayani area Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
10. Kontak: WhatsApp +62 812 3456 7890, email hello@sikacling.id.
11. Garansi: Jika pelanggan tidak puas, SikaCling menawarkan cuci ulang gratis.

Pertanyaan pelanggan: "${query}"

Jawaban (singkat, informal, ramah, dan hanya fokus pada informasi SikaCling):`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      const data = await response.json();
      
      // Handle potential errors in the API response
      if (data.error) {
        console.error('Gemini API returned an error:', data.error);
        return getFallbackResponse(query);
      }
      
      // Updated response parsing logic for Gemini 2.0
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0] && 
          data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected Gemini API response structure:', data);
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return getFallbackResponse(query);
    }
  };

  // Fallback responses in case the API fails
  const getFallbackResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Simple keyword-based responses - focused only on SikaCling products and services
    const responses: { [key: string]: string } = {
      'harga': 'Kami menawarkan Cuci Dasar (Rp25.000), Cuci Premium (Rp50.000), dan Repaint & Restoration (Rp150.000). Harga bisa berbeda tergantung kondisi sepatu.',
      'biaya': 'Kami menawarkan Cuci Dasar (Rp25.000), Cuci Premium (Rp50.000), dan Repaint & Restoration (Rp150.000). Harga bisa berbeda tergantung kondisi sepatu.',
      'waktu': 'Waktu pengerjaan kami: Cuci Dasar (3 hari), Cuci Premium (1 hari), dan Repaint & Restoration (sekitar 1 bulan).',
      'durasi': 'Waktu pengerjaan kami: Cuci Dasar (3 hari), Cuci Premium (1 hari), dan Repaint & Restoration (sekitar 1 bulan).',
      'antar': 'Ya, kami menyediakan layanan antar-jemput sepatu untuk area Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Biaya bervariasi tergantung lokasi.',
      'jemput': 'Ya, kami menyediakan layanan antar-jemput sepatu untuk area Jakarta, Bogor, Depok, Tangerang, dan Bekasi. Biaya bervariasi tergantung lokasi.',
      'jenis sepatu': 'Kami dapat menangani hampir semua jenis sepatu: sneakers, sepatu kanvas, sepatu kulit, sepatu suede, dan sepatu atletik.',
      'material': 'Kami dapat menangani hampir semua jenis material sepatu: canvas, leather, suede, knit, dan banyak lagi.',
      'jaminan': 'Kami memberikan garansi kepuasan. Jika Anda tidak puas dengan hasil, kami akan mencuci ulang sepatu Anda secara gratis.',
      'bayar': 'Kami menerima pembayaran via transfer bank, e-wallet (GoPay, OVO, DANA, LinkAja), dan tunai saat pengambilan/pengiriman.',
      'tracking': 'Anda dapat melacak status pesanan di website kami dengan memasukkan nomor order Anda.',
      'lokasi': 'Toko fisik kami berada di Jl. Contoh No. 123, Jakarta. Kami melayani area Jakarta, Bogor, Depok, Tangerang, dan Bekasi.',
      'jam': 'Jam operasional kami adalah 08:00 - 20:00 WIB setiap hari.',
      'booking': 'Anda dapat melakukan booking melalui website kami atau menghubungi kami via WhatsApp di +62 812 3456 7890.',
      'perbedaan': 'Cuci Dasar fokus pada bagian luar sepatu, sedangkan Cuci Premium mencakup pembersihan menyeluruh termasuk bagian dalam dan deodorisasi.',
      'repaint': 'Repaint & Restoration adalah layanan premium untuk memperbarui warna dan memperbaiki sepatu yang sangat kotor atau rusak.',
      'whatsapp': 'Anda dapat menghubungi kami via WhatsApp di +62 812 3456 7890.',
      'kontak': 'Anda dapat menghubungi kami via WhatsApp di +62 812 3456 7890 atau email ke hello@sikacling.id.',
    };
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowercaseQuery.includes(keyword)) {
        return response;
      }
    }

    // Default response if no keywords match
    return 'Untuk informasi lebih lanjut tentang layanan cuci sepatu SikaCling, silakan tanyakan tentang harga, jenis layanan, waktu pengerjaan, atau hubungi kami via WhatsApp di +62 812 3456 7890.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChatBot = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChatBot}
        className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-primary'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-white text-2xl`}></i>
        
        {/* Notification dot for when chat is closed */}
        {!isOpen && messages.length > 1 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary p-4 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h3 className="font-medium">Asisten SikaCling</h3>
                <p className="text-xs text-white text-opacity-80">Powered by Gemini AI</p>
              </div>
              <div className="ml-auto">
                {isTyping ? (
                  <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
                    Mengetik...
                  </span>
                ) : (
                  <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="bg-white p-4 border-t">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder="Tanyakan tentang layanan kami..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <button
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-r-lg transition"
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isTyping}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>SikaCling © {new Date().getFullYear()}</span>
              <button onClick={() => window.open('https://wa.me/6281234567890', '_blank')} className="text-primary hover:underline">
                Hubungi CS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;