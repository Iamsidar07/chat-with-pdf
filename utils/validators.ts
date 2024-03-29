import z from "zod";

const getFileValidator = z.object({
  id: z.string(),
});
