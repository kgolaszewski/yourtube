from django.core.management.base import BaseCommand

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.firefox import GeckoDriverManager

from youtube.models import Youtuber, Video
from datetime import datetime, timedelta

from time import sleep
import pytz



def scrape(updating_videos=False, headless=True):

    if headless: 
        options = FirefoxOptions()
        options.add_argument("--headless")
        driver = webdriver.Firefox(executable_path=GeckoDriverManager().install(), options=options)
    else:
        driver = webdriver.Firefox(executable_path=GeckoDriverManager().install())

    # Wait up to 60 seconds, but continue if you find the element
    driver.implicitly_wait(60)

    youtubers = [x for x in Youtuber.objects.all()]
    # youtubers = [Youtuber.objects.get(username="chessbrah")]

    est = pytz.timezone('America/New_York')

    print(f"\n--- Updated at: {datetime.now(est).strftime('%Y-%m-%d %H:%M')} ---")

    for youtuber in youtubers:
        try:
            driver.get(youtuber.channel)
            latest = driver.find_element(By.ID, "video-title-link")

            result = {}
            href = latest.get_attribute("href")

            result["video_id"] =  href.split("/shorts/")[1] if "/shorts/" in href else href.split("=")[1]

            # print(result["video_id"], latest.get_attribute("title"))
            print(f"@{youtuber.username:18} {latest.get_attribute('title')}")

            if updating_videos:
                if Video.objects.filter(video_id=result["video_id"]).exists():
                    current = Video.objects.get(video_id=result["video_id"])

                    result["title"]    = latest.get_attribute("title")
                    result["youtuber"] = youtuber.username

                    driver.get(f"https://youtube.com/watch?v={result['video_id']}")
                    datetext = driver.find_element(By.ID, "info-strings").text
                    result["date"] = datetime.strptime(datetext.split("Premiered ")[-1], "%b %d, %Y")
                    lengthtext = driver.find_element(By.CLASS_NAME, "ytp-time-duration").text

                    video_len = int(driver.execute_script("return document.getElementById('movie_player').getDuration()"))
                    result["length"] = timedelta(seconds=int(video_len))

                    current = Video(
                            video_id=result["video_id"],
                            title=result["title"],
                            date=result["date"],
                            length=result["length"],
                            youtuber=Youtuber.objects.get(username=result["youtuber"]),
                    )
                    current.save()
                    youtuber.last_upload = result["video_id"]
                    youtuber.save()

                    print(f"@{youtuber.username}: {result['title']} [{result['length']}] ({result['date']})")
            else:
                if youtuber.last_upload != result["video_id"]:

                    result["title"]    = latest.get_attribute("title")
                    result["youtuber"] = youtuber.username

                    driver.get(f"https://youtube.com/watch?v={result['video_id']}")

                    driver.find_element(By.ID, "description-inner").click()
                    datetext = driver.find_element(By.ID, "info-container").text.split("views  ")[1].split("#")[0].rstrip()

                    # datetext = driver.find_element(By.ID, "info").text

                    if "Premiered" in datetext:
                        print("Premiere conditional activated")
                        if "ago" in datetext:
                            timeunits = {"second": 1, "minute": 60, "hour": 3600, "day": 24*3600}
                            tdelta = 0
                            for t in timeunits:
                                if t in datetext:
                                    tdelta += timeunits[t]*int(datetext.split("Premiered ")[-1].split(f" {t}")[0])
                            result["date"] = (datetime.now() - timedelta(seconds=tdelta)).date()
                        else:
                            result["date"] = datetime.strptime(datetext.split("Premiered ")[-1], "%b %d, %Y")
                    elif "Streamed" in datetext:
                        if "on" in datetext:
                            result["date"] = datetime.strptime(datetext.split("on ")[-1], "%b %d, %Y")
                        else:
                            timeunits = {"second": 1, "minute": 60, "hour": 3600, "day": 24*3600}
                            tdelta = 0
                            for t in timeunits:
                                if t in datetext:
                                    tdelta += timeunits[t]*int(datetext.split("live ")[-1].split(f" {t}")[0])
                            result["date"] = (datetime.now() - timedelta(seconds=tdelta)).date()
                    else:
                        if "ago" in datetext:
                            timeunits = {"second": 1, "minute": 60, "hour": 3600, "day": 24*3600}
                            tdelta = 0
                            for t in timeunits:
                                if t in datetext:
                                    tdelta += timeunits[t]*int(datetext.split("live ")[-1].split(f" {t}")[0])
                            result["date"] = (datetime.now() - timedelta(seconds=tdelta)).date()
                        else:
                            result["date"] = datetime.strptime(datetext, "%b %d, %Y")

                    lengthtext = driver.find_element(By.CLASS_NAME, "ytp-time-duration").text
                    video_len = int(driver.execute_script(
                        "return document.getElementById('movie_player').getDuration()"
                    ))
                    result["length"] = timedelta(seconds=int(video_len))

                    new = Video(
                            video_id=result["video_id"],
                            title=result["title"],
                            date=result["date"],
                            length=result["length"],
                            youtuber=Youtuber.objects.get(username=result["youtuber"]),
                    )
                    new.save()
                    youtuber.last_upload = result["video_id"]
                    youtuber.save()

                    r = result
                    print(f"@{youtuber.username}: {r['title']} [{r['length']}] ({r['date']})")

        except Exception as e:
            print(f"ERROR: {e} ({youtuber})")

    if headless: 
        driver.quit()


class Command(BaseCommand):
    help = "Check youtube.com for latest upload from each Youtuber"    
    # define logic of command
    def handle(self, *args, **options):
        scrape(headless=True)
        self.stdout.write( '\n' )