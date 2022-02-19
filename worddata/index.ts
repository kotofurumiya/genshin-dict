import { PartialDictItem, DictItem } from './dict';
import * as system from './system';
import * as world from './world';
import * as person from './person';
import * as place from './place';
import * as item from './item';

type DictItemBuilder = (item: PartialDictItem) => DictItem;

const toNoun: DictItemBuilder = (item) => ({
  ...item,
  hinshi: '普通名詞'
});

const toPersonName: DictItemBuilder = (item) => ({
  ...item,
  hinshi: '人名'
});

const toLocationName: DictItemBuilder = (item) => ({
  ...item,
  hinshi: '地名'
});

type PartialDictMap<T> = Record<keyof T, PartialDictItem[]>;
type DictMap<T> = Record<keyof T, DictItem[]>;

const toDict = <T>(partial: PartialDictMap<T>, converter: DictItemBuilder) => {
  return Object.entries<PartialDictItem[]>(partial).reduce((prev, [key, list]) => ({
    ...prev,
    [key]: list.map(converter),
  }), {} as DictMap<T>);
}

const systemDict = toDict(system, toNoun);
const worldDict = toDict(world, toNoun);
const personDict = toDict(person, toPersonName);
const placeDict = toDict(place, toLocationName);
const itemDict = toDict(item, toNoun);

const combined = [
  ...systemDict.system,
  ...worldDict.teyvat,
  ...worldDict.enemy,
  ...personDict.mond,
  ...personDict.riyue,
  ...personDict.inazuma,
  ...personDict.snezhnaya,
  ...personDict.khaenriah,
  ...placeDict.mond,
  ...placeDict.dragonspine,
  ...placeDict.riyue,
  ...placeDict.inazuma,
  ...placeDict.snezhnaya,
  ...placeDict.khaenriah,
  ...placeDict.other,
  ...itemDict.weapon,
  ...itemDict.food,
  ...itemDict.stuff,
];

export default {
  system: systemDict,
  all: combined,
  world: worldDict,
  person: personDict,
  place: placeDict,
  item: itemDict,
};