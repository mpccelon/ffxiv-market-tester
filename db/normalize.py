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


# write to csv
base_item_json = []
normalized_directory = Path(script_directory / "../server/src/database/seed_json/")
with open(normalized_directory / 'base_item.json', 'w') as json_file:
    for key, value in base_item.items():
        base_item_json.append({
            "id": key,
            "name": value["name"],
            "is_craftable": value["is_craftable"]
        })
    json.dump(base_item_json, json_file)
    print(f'Added base_item.json to {normalized_directory.absolute()}')


# recipe table
# - recipe_id
# - result_item_id
# - yield
base_recipe_json = []
with open(normalized_directory / 'base_recipes.json', 'w') as json_file:
    for item in base_item_json:
        if item["is_craftable"]:
            for recipe in recipe_data[str(item["id"])]:
                base_recipe_json.append({
                    "id": recipe["id"],
                    "result_item_id": item["id"],
                    "yield":  recipe["yields"]
                })
    json.dump(base_recipe_json, json_file)
    print(f'Added base_recipe.json to {normalized_directory.absolute()}')


# ingredients table
# - recipe_id
# - item_id
# - quantity
base_ingredients_json = []
with open(normalized_directory / 'base_ingredients.json', 'w') as json_file:
    for item in base_item_json:
        if item["is_craftable"]:
            for recipe in recipe_data[str(item["id"])]:
                for ingredient in recipe["ingredients"]:
                    base_ingredients_json.append({
                        "recipe_id": recipe["id"],
                        "item_id": ingredient["id"],
                        "quantity":  ingredient["amount"]
                    })
    json.dump(base_ingredients_json, json_file)
    print(f'Added base_ingredients.json to {normalized_directory.absolute()}')
