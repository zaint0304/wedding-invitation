import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  CreateWishBody,
  CreateWishResponse,
  ListWishesResponse,
} from "@workspace/api-zod";
import { db, guestWishesTable } from "@workspace/db";

const INVITATION_ID = "ubaid-zaib-walima-2026";
const MAX_WISHES = 500;

const router: IRouter = Router();

router.get("/wishes", async (_req, res): Promise<void> => {
  const wishes = await db
    .select({
      id: guestWishesTable.id,
      guestName: guestWishesTable.guestName,
      message: guestWishesTable.message,
      createdAt: guestWishesTable.createdAt,
    })
    .from(guestWishesTable)
    .where(eq(guestWishesTable.invitationId, INVITATION_ID))
    .orderBy(desc(guestWishesTable.createdAt), desc(guestWishesTable.id))
    .limit(MAX_WISHES);

  res.json(ListWishesResponse.parse(wishes));
});

router.post("/wishes", async (req, res): Promise<void> => {
  const parsed = CreateWishBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid wedding wish");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const guestName = parsed.data.guestName.trim();
  const message = parsed.data.message.trim();
  if (!guestName || !message) {
    res.status(400).json({ error: "Name and wish are required." });
    return;
  }

  const [wish] = await db
    .insert(guestWishesTable)
    .values({ invitationId: INVITATION_ID, guestName, message })
    .returning({
      id: guestWishesTable.id,
      guestName: guestWishesTable.guestName,
      message: guestWishesTable.message,
      createdAt: guestWishesTable.createdAt,
    });

  if (!wish) {
    res.status(500).json({ error: "Could not save the wish." });
    return;
  }

  res.status(201).json(CreateWishResponse.parse(wish));
});

export default router;
