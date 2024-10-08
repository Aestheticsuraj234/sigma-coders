import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messageId, communityId, channelId } = req.query;
    const { content , user } = req.body;

   console.log(req.body);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!communityId) {
      return res.status(400).json({ error: "community ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    const community = await db.community.findFirst({
      where: {
        id: communityId as string,
        members: {
          some: {
            userId: user.id,
          }
        }
      },
      include: {
        members: true,
      }
    })

    if (!community) {
      return res.status(404).json({ error: "community not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        communityId: communityId as string,
      },
    });
  
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = community.members.find((member) => member.userId === user.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          }
        }
      }
    })

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    console.log("[MESSAGE_ID]", { isMessageOwner, isAdmin, isModerator, canModify });

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true,
            }
          }
        }
      })
    }

    console.log("[MESSAGE_ID]", { content });

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              user: true,
            }
          }
        }
      })
    }

    console.log("[MESSAGE_ID]", message );

    const updateKey = `chat:${channelId}:messages:update`;
    

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}