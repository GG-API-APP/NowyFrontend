/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { Conversation, ConversationPair } from "./types";
import { UserCard } from "./components/UserCard";
import clsx from "clsx";
import { format } from "date-fns";

function App() {
  const [conversationPair, setConversationPair] = useState<ConversationPair[]>(
    []
  );
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversation, setConversation] = useState<{
    personOne: string;
    messages: Conversation[];
  }>({ personOne: "", messages: [] });

  const protocol = import.meta.env.VITE_PROTOCOL;
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchConversationPairs = async () => {
      const data = await axios.get(`${protocol}://${serverUrl}/conversations`);
      setConversationPair(data.data);
    };
    fetchConversationPairs();
  }, []);

  const fetchConversation = async (personOneNumber: string) => {
    setConversationLoading(true);
    const data = await axios.get(
      `${protocol}://${serverUrl}/conversations/${personOneNumber}`
    );
    setConversation({ personOne: personOneNumber, messages: data.data });
    setConversationLoading(false);
  };

  const styles = {
    avatar:
      "rounded-full shadow-lg overflow-hidden bg-gray-500 min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]",
    messageBox: "bg-gray-300 p-[4px] rounded-lg shadow-lg",
    conversationPairCard:
      "flex justify-between bg-yellow-500 rounded shadow-lg m-[12px] p-[12px] hover:bg-blue-200 hover:cursor-pointer",
    conversationMessage: (authorPerson: string) =>
      clsx("flex items-center py-[8px] gap-x-[8px]", {
        "place-content-end": authorPerson !== conversation.personOne,
      }),
  };

  return (
    <div className="flex h-[100vh]">
      <div className="bg-yellow-700 min-w-[700px] overflow-auto">
        {conversationPair.map((pair) => (
          <div
            key={pair._id}
            onClick={() => fetchConversation(pair.personOne)}
            className={styles.conversationPairCard}
          >
            <UserCard
              personOne={pair.personOne}
              personOneName={pair.personOneName}
            />
            <div className="flex items-center">{`Wymienili ${pair.messageCount} wiadomości`}</div>
            <UserCard
              personOne={pair.personTwo}
              personOneName={pair.personTwoName}
              mirrored
            />
          </div>
        ))}
      </div>
      <div className="bg-gray-200 w-full overflow-auto px-[8px]">
        {conversationLoading
          ? "Loading..."
          : conversation.messages.map((conv) => {
              const imageUrlPattern =
                /\.(jpeg|jpg|png|gif|bmp|webp|tiff|svg)$/i;
              const isPhoto = imageUrlPattern.test(conv.message);

              return (
                <div
                  key={conv._id}
                  className={styles.conversationMessage(conv.authorPerson)}
                >
                  <div className={styles.avatar}>
                    <img
                      src={`https://avatars.gg.pl/user,${conv.authorPerson}/s,60x60`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "./assets/user.png";
                      }}
                    />
                  </div>
                  <div className={styles.messageBox}>
                    <div className="font-bold">
                      {format(conv.createdAt, "dd-MM-yyyy kk:mm:ss")}
                    </div>
                    {isPhoto ? (
                      <img
                        className="max-h-[250px] max-w-[250px]"
                        src={conv.message}
                      />
                    ) : (
                      <div
                        className="w-fit p-[4px]"
                        title={conv.originalMessage}
                      >
                        {conv.message}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default App;
