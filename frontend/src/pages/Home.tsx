import React from "react";
import { useCallback, useEffect, useState } from "react";
import { channel } from "../types/schema";
import { ChannelCreateModal } from "../components/ChannelCreateModal";

export const Home: React.FC = () => {
  const [channels, setChannels] = useState<channel[] | undefined>(undefined);
  const [createChannelModalOpen, setCreateChannelModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/channels")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setChannels(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handlePostChannel = useCallback(async (channelName: string) => {
    if (!channelName) {
      setCreateChannelModalOpen(false);
      return;
    }

    try {
      // TODO: POSTしたチャンネルを返さないので返すようにしたら戻り値を使用する
      await fetch("/api/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: titleじゃなくてnameにしたい
        body: JSON.stringify({ title: channelName }),
      });

      setCreateChannelModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <div>
        <button onClick={() => setCreateChannelModalOpen(true)}>
          Add Channel
        </button>
      </div>
      <div>
        {channels && (
          <ul style={{ listStyleType: "none" }}>
            {channels.map((channel) => (
              <li key={channel.ID}>{channel.title}</li>
            ))}
          </ul>
        )}
      </div>
      {createChannelModalOpen && (
        <ChannelCreateModal
          handleModalClose={() => setCreateChannelModalOpen(false)}
          handlePostChannel={handlePostChannel}
        />
      )}
    </>
  );
};