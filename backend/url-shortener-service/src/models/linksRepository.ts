import linkModel, { ILinkModel } from './linkModel';
import { Link } from './link';

function findByCode(code: string): Promise<ILinkModel | null> {
  return linkModel.findOne<ILinkModel>({ where: { code } });
}

function add(link: Link): Promise<ILinkModel> {
  return linkModel.create<ILinkModel>(link);
}

async function hit(code: string): Promise<ILinkModel | null> {
  const link = await findByCode(code);

  if (!link) return null;

  link.hits!++;
  await link.save();
  return link;
}

export default {
  findByCode,
  add,
  hit,
};
