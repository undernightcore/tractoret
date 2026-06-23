import { RequestHandler } from "express";
import { HttpError } from "../errors/http";
import { prisma } from "../services/prisma";
import { filterValidator } from "../validators/common/filter";
import { paginationValidator } from "../validators/common/pagination";
import { createGroupValidator } from "../validators/group/create";

export const getGroups: RequestHandler = async (req, res) => {
  const { direction, orderBy, search } = filterValidator.parse(req.body);
  const { page, pageSize } = paginationValidator.parse(req.body);

  const [routes, total] = await prisma.$transaction([
    prisma.group.findMany({
      where: { name: { contains: search } },
      orderBy: orderBy && direction ? { [orderBy]: direction } : undefined,
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.group.count({
      where: { name: { contains: search } },
    }),
  ]);

  return res.status(200).json({ routes, total });
};

export const createGroup: RequestHandler = async (req, res) => {
  const data = createGroupValidator.parse(req.body);

  const conflicting = await prisma.group.findUnique({
    where: { name: data.name },
  });
  if (conflicting)
    throw new HttpError(409, "There is already a group with that name");

  const created = await prisma.group.create({ data });

  return res.status(200).json(created);
};

export const editGroup: RequestHandler = async (req, res) => {
  const data = createGroupValidator.parse(req.body);

  const existing = await prisma.group.findUnique({
    where: { id: Number(req.params.groupId) },
  });
  if (!existing) throw new HttpError(404, "Group not found");

  const conflicting = await prisma.group.findUnique({
    where: { name: data.name, NOT: { id: existing.id } },
  });
  if (conflicting)
    throw new HttpError(409, "There is already a group with that name");

  const created = await prisma.group.create({ data });

  return res.status(200).json(created);
};

export const deleteGroup: RequestHandler = async (req, res) => {
  const existing = await prisma.group.findUnique({
    where: { id: Number(req.params.groupId) },
  });
  if (!existing) throw new HttpError(404, "Group not found");

  await prisma.group.delete({ where: { id: existing.id } });
};
