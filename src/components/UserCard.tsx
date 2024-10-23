import clsx from "clsx";
import React from "react";

type UserCardProps = {
  personOne: string;
  personOneName?: string;
  mirrored?: boolean;
};

export const UserCard = ({
  personOne,
  personOneName,
  mirrored = false,
}: UserCardProps) => {
  const styles = {
    conversationPairCardPerson: clsx("flex items-center gap-x-[8px]", {
      "flex-row-reverse": mirrored,
    }),
    avatar:
      "rounded-full shadow-lg overflow-hidden bg-red-500 min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]",
  };

  return (
    <div className={styles.conversationPairCardPerson}>
      <div className={styles.avatar}>
        <img
          src={`https://avatars.gg.pl/user,${personOne}/s,60x60`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "../assets/user.png";
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="font-bold">{personOneName}</div>
        <div>{personOne}</div>
      </div>
    </div>
  );
};
