/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { Conversation, ConversationPair } from "./types";
import { UserCard } from "./components/UserCard";
import clsx from "clsx";
import { format } from "date-fns";
import { Spinner } from "./components/Spinner";
import userIcon from "./assets/user.png";

function App() {
  const [conversationPair, setConversationPair] = useState<ConversationPair[]>(
    []
  );
  const [conversationLiastLoading, setConversationListLoading] =
    useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversation, setConversation] = useState<{
    personOne: string;
    messages: Conversation[];
  }>({ personOne: "", messages: [] });
  const [displayOriginalMessages, setDisplayOriginalMessages] = useState(false);

  const protocol = import.meta.env.VITE_PROTOCOL;
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    setConversationListLoading(true);
    const fetchConversationPairs = async () => {
      const data = await axios.get(`${protocol}://${serverUrl}/conversations`);
      setConversationPair(data.data);
      setConversationListLoading(false);
    };
    fetchConversationPairs();
  }, []);

  const fetchConversation = async (pair: ConversationPair) => {
    const personToFetch = [pair.personOne, pair.personTwo].sort()[0];
    setConversationLoading(true);
    const data = await axios.get(
      `${protocol}://${serverUrl}/conversations/${personToFetch}`
    );
    setConversation({ personOne: personToFetch, messages: data.data });
    setConversationLoading(false);
  };

  const styles = {
    avatar:
      "rounded-full shadow-lg overflow-hidden bg-gray-500 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px]",
    messageBox: "bg-gray-300 p-[4px] rounded-lg shadow-lg",
    conversationPairCard:
      "flex flex-col items-start justify-between bg-yellow-500 rounded shadow-lg m-[12px] p-[12px] hover:bg-blue-200 hover:cursor-pointer gap-y-[4px]",
    conversationMessage: (authorPerson: string) =>
      clsx("flex items-center py-[8px] gap-x-[8px]", {
        "place-content-end flex-row-reverse":
          authorPerson !== conversation.personOne,
      }),
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="flex bg-yellow-300 p-[8px]">
        <button
          onClick={() => setDisplayOriginalMessages((prev) => !prev)}
        >{`Set to ${displayOriginalMessages ? "validated" : "original"} messages`}</button>
      </div>
      <div className="flex w-full h-full overflow-auto">
        {" "}
        <div className="bg-yellow-700 min-w-[700px] overflow-auto">
          {conversationLiastLoading ? (
            <Spinner />
          ) : (
            conversationPair.map((pair) => (
              <div
                key={pair._id}
                onClick={() => fetchConversation(pair)}
                className={styles.conversationPairCard}
              >
                <div className="flex">
                  <UserCard
                    person={pair.personOne}
                    personName={pair.personOneName}
                    personDescription={pair.personOneDescription}
                  />
                  <div className="flex items-center text-xl font-bold">
                    ({pair.messageCount})
                  </div>
                  <UserCard
                    person={pair.personTwo}
                    personName={pair.personTwoName}
                    personDescription={pair.personTwoDescription}
                    mirrored
                  />
                </div>
                <i className="truncate w-full text-s">
                  {`Ostatnio: ${pair.lastMessge}`}
                </i>
              </div>
            ))
          )}
        </div>
        <div className="bg-gray-200 w-full overflow-auto px-[8px]">
          {conversationLoading ? (
            <Spinner />
          ) : (
            conversation.messages.map((conv) => {
              const imageUrlPattern =
                /\.(jpeg|jpg|png|gif|bmp|webp|tiff|svg)$/i;
              const isPhoto = imageUrlPattern.test(conv.originalMessage);
              const isGGPhoto =
                isPhoto &&
                conv.originalMessage.includes("https://www.gg.pl/dysk/");

              return (
                <div
                  key={conv._id}
                  className={styles.conversationMessage(conv.authorPerson)}
                >
                  <div className={styles.avatar}>
                    <img
                      src={`https://avatars.gg.pl/user,${conv.authorPerson}/s,80x80`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = userIcon;
                      }}
                    />
                  </div>
                  <div className={styles.messageBox}>
                    <div className="font-bold text-xs">
                      {format(conv.createdAt, "dd-MM-yyyy kk:mm:ss")}
                    </div>
                    <i className="text-xs">{conv.authorPerson}</i>
                    {isPhoto ? (
                      <img
                        className="max-h-[250px] max-w-[250px]"
                        src={
                          displayOriginalMessages
                            ? isGGPhoto
                              ? conv.originalMessage.replace(
                                  "www.gg.pl/dysk/",
                                  "p.gg.pl/thumb/p/d/"
                                )
                              : conv.originalMessage
                            : conv.message
                        }
                      />
                    ) : (
                      <div
                        className="w-fit p-[4px]"
                        title={
                          displayOriginalMessages
                            ? conv.message
                            : conv.originalMessage
                        }
                      >
                        {displayOriginalMessages
                          ? conv.originalMessage
                          : conv.message}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
