#!/usr/bin/env python3

import json
import csv
from pathlib import Path

script_directory = Path(__file__).parent
raw_directory = Path(script_directory / "./raw_json/")

item_data = json.load(open(raw_directory / "items.json"))
market_items = json.load(open(raw_directory / "market-items.json"))
recipe_data = json.load(open(raw_directory / "recipes-per-item.json"))


# market_item table
# - item_id
# - name (just english name for now)
# - is_craftable 
base_item = dict()

# only include:
# - market items
# - items that can be made purely from market items
for item_id, name in item_data.items():
    not_in_market = set()
    
    # invalid item
    if name["en"] == "":
        continue

    # no recipe for this item
    if item_id not in recipe_data:
        base_item[int(item_id)] = {
            "name": name["en"],
            "is_craftable": False
        }
        continue

    for recipe in recipe_data[item_id]:
        for ingredients in recipe["ingredients"]:
            if int(ingredients["id"]) not in market_items:
                not_in_market.add(int(ingredients["id"]))

    # all ingredients for all recipes are in market
    if len(not_in_market) == 0:
        base_item[int(item_id)] = {
            "name": name["en"],
            "is_craftable": True
        }
        continue

    # # list items not in market but used to make market items
    # for id in not_in_market:
    #     print(f'NOT IN MARKET: \'{item_data[str(id)]["en"]}\' used for \'{name["en"]}\'')

print(len(base_item))

# write to csv
normalized_directory = Path(script_directory / "../server/src/database/seed_json/")
with open(normalized_directory / 'base_item.json', 'w') as json_file:
    base_item_json = []
    for key, value in base_item.items():
        base_item_json.append({
            "id": key,
            "name": value["name"],
            "is_craftable": value["is_craftable"]
        })
    json.dump(base_item_json, json_file)


# market_item_recipe table
# - recipe_id
# - result_item_id
# - yield
# base_market_item_recipe = dict()
# for item_id in market_items:
#     for item_id in 
#     base_market_item_recipe[item_id] = {
#         ""
#     }
