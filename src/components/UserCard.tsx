import clsx from "clsx";
import userIcon from "../assets/user.png";

type UserCardProps = {
  person: string;
  personName?: string;
  personDescription?: string;
  mirrored?: boolean;
};

export const UserCard = ({
  person,
  personName,
  personDescription,
  mirrored = false,
}: UserCardProps) => {
  const styles = {
    conversationPairCardPerson: clsx(
      "flex content-center flex-col gap-x-[8px] max-w-[300px] min-w-[300px] items-center justify-center",
      {
        "items-start ": !mirrored,
        "items-end": mirrored,
      }
    ),
    avatarContainer: "w-full flex justify-center",
    avatar:
      "rounded-full shadow-lg overflow-hidden bg-gray-400 min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]",
    personDetails: clsx("w-full flex flex-col items-center", {
      "items-start": !mirrored,
      "items-end": mirrored,
    }),
  };

  return (
    <div className={styles.conversationPairCardPerson}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <img
            src={`https://avatars.gg.pl/user,${person}/s,60x60`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = userIcon;
            }}
          />
        </div>
      </div>
      <div className={styles.personDetails}>
        <div className="font-bold">{personName || "?"}</div>
        <div>{person || "∞"}</div>
      </div>
      <i className="text-xs truncate max-w-full">{personDescription}</i>
    </div>
  );
};
