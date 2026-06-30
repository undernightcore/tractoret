import { RequestHandler } from "express";
import { HttpError } from "../errors/http";
import { prisma } from "../services/prisma";
import { getLinkData, getUrlData } from "../services/scrapper";
import { filterValidator } from "../validators/common/filter";
import { paginationValidator } from "../validators/common/pagination";
import { createLinkValidator } from "../validators/link/create";
import { deleteLinksValidator } from "../validators/link/delete";
import { editLinkValidator } from "../validators/link/update";

export const getLinks: RequestHandler = async (req, res) => {
  const { direction, orderBy, search } = filterValidator.parse(req.body);
  const { page, pageSize } = paginationValidator.parse(req.body);

  const group = await prisma.group.findUnique({
    where: { id: Number(req.params.groupId) },
  });
  if (!group) throw new HttpError(404, "Group not found");

  const [links, total] = await prisma.$transaction([
    prisma.link.findMany({
      where: {
        name: { contains: search },
        groupId: group.id,
        OR: [{ url: { contains: search } }],
      },
      orderBy: orderBy && direction ? { [orderBy]: direction } : undefined,
      omit: { last: true },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.link.count({
      where: {
        name: { contains: search },
        groupId: group.id,
        OR: [{ url: { contains: search } }],
      },
    }),
  ]);

  return res.status(200).json({ links, total });
};

export const getLink: RequestHandler = async (req, res) => {
  const link = await prisma.link.findUnique({
    where: {
      id: Number(req.params.linkId),
      groupId: Number(req.params.groupId),
    },
  });

  if (!link) throw new HttpError(404, "Link not found");

  return res.status(200).json(link);
};

export const createLink: RequestHandler = async (req, res) => {
  const { url } = createLinkValidator.parse(req.body);

  const group = await prisma.group.findUnique({
    where: { id: Number(req.params.groupId) },
  });
  if (!group) throw new HttpError(404, "Group not found");

  const link = await getUrlData(url).catch(() => undefined);
  if (!link)
    throw new HttpError(
      400,
      "Link could not be parsed, please try again later..."
    );
  const { price, stock } = getLinkData(
    link.content,
    group.stockIfPresent,
    group.priceLocator
  );

  const created = await prisma.link.create({
    data: {
      url,
      name: link.title,
      last: link.content,
      lastPrice: price ?? "-",
      lastStock: stock,
      groupId: group.id,
    },
  });

  return res.status(200).json(created);
};

export const editLink: RequestHandler = async (req, res) => {
  const { name } = editLinkValidator.parse(req.body);

  const existing = await prisma.link.findUnique({
    where: {
      id: Number(req.params.linkId),
      groupId: Number(req.params.groupId),
    },
  });
  if (!existing) throw new HttpError(404, "Link not found");

  const updated = await prisma.link.update({
    where: { id: Number(req.params.linkId) },
    data: { name },
  });

  return res.status(200).json(updated);
};

export const deleteLink: RequestHandler = async (req, res) => {
  const existing = await prisma.link.findUnique({
    where: {
      id: Number(req.params.linkId),
      groupId: Number(req.params.groupId),
    },
  });
  if (!existing) throw new HttpError(404, "Link not found");

  await prisma.link.delete({ where: { id: existing.id } });

  return res.status(200).json({ message: "Link deleted succesfully" });
};

export const deleteLinks: RequestHandler = async (req, res) => {
  const links = deleteLinksValidator.parse(req.body);

  const { count } = await prisma.link.deleteMany({
    where: { id: { in: links }, groupId: Number(req.params.groupId) },
  });

  return res
    .status(200)
    .json({ message: `${count} links deleted succesfully` });
};
