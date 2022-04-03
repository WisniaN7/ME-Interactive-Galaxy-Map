import json
import os
import re
import pandas as pd
import urllib
from urllib.request import Request
from bs4 import BeautifulSoup
import requests

url = "https://masseffect.fandom.com/wiki/Systems"

with urllib.request.urlopen(url) as resp:
  page = BeautifulSoup(resp.read().decode("utf-8"), "html.parser")

full_clusters_data = page.find_all("table", {"style": "width:100%; border:0;"})

full_clusters_data[0].find("tbody")

temp = []
for table in full_clusters_data:
  temp.append(table.find("tbody"))

full_clusters_data = temp

clusters_data = []

for cluster_html in full_clusters_data:
  cluster = {}
  cluster['name'] = cluster_html.find('a').text
  print("Getting: " + cluster['name'])
  cluster['top'] = 0
  cluster['left'] = 0

  cluster_url = 'https://masseffect.fandom.com' + cluster_html.find('a')['href']

  with urllib.request.urlopen(cluster_url) as resp:
    cluster_page = BeautifulSoup(resp.read().decode("utf-8"), "html.parser")
  
  img = cluster_page.find('img', {"class": "pi-image-thumbnail"})

  if img is not None:
    head, sep, tail = img['src'].partition('latest')
    img_data = requests.get(head + sep).content

    with open('./img/clusters/' + cluster['name'] + '.webp', 'wb') as handler:
        handler.write(img_data)
  
  """
  if img is not None:
    head, sep, tail = img['src'].partition('.png')
    cluster['img'] = head + sep
  """

  cluster['systems'] = []
  system_names = cluster_html.find_all("div", {"style": "background:#223; margin-top:3px; padding:2px 8px 0; font-weight:bold; font-size:12px;"})

  row = 3

  for system_html in system_names:
    temp_sys = {}
    temp_sys['name'] = system_html.find("a").text
    temp_sys['top'] = 0
    temp_sys['left'] = 0

    system_url = 'https://masseffect.fandom.com' + system_html.find('a')['href']

    with urllib.request.urlopen(system_url) as resp:
      system_page = BeautifulSoup(resp.read().decode("utf-8"), "html.parser")
    
    img = system_page.find('img', {"class": "pi-image-thumbnail"})

    if img is not None:
      head, sep, tail = img['src'].partition('latest')
      img_data = requests.get(head + sep).content

      with open('./img/systems/' + temp_sys['name'] + '.webp', 'wb') as handler:
          handler.write(img_data)
    
    """
    if img is not None:
      head, sep, tail = img['src'].partition('.png')
      temp_sys['img'] = head + sep
    """

    temp_sys['planets'] = []

    planet_names = cluster_html.select('tr:nth-of-type(' + str(row) + ')')[0].find_all("a")
    row = row + 2

    for planet_html in planet_names:
      temp_planet = {}
      temp_planet['name'] = planet_html.text
      temp_planet['top'] = 0
      temp_planet['left'] = 0

      temp_sys['planets'].append(temp_planet)
    
    cluster['systems'].append(temp_sys)

  clusters_data.append(cluster)

json_object = json.dumps(clusters_data)

with open("data.json", "w") as outfile:
    outfile.write(json_object)
