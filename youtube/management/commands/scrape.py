from django.core.management.base import BaseCommand

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.firefox import GeckoDriverManager

from youtube.models import Youtuber, Video
from datetime import datetime, timedelta

from time import sleep



def scrape():

    options = FirefoxOptions()
    options.add_argument("--headless")
    driver = webdriver.Firefox(executable_path=GeckoDriverManager().install(), options=options)

    # Wait up to 60 seconds, but continue if you find the element
    driver.implicitly_wait(60)


    youtubers = [x for x in Youtuber.objects.all()]

    for youtuber in youtubers:
        try:
            driver.get(youtuber.channel)
            latest = driver.find_element(By.ID, "video-title")

            result = {}
            href = latest.get_attribute("href")
            result["video_id"] =  href.split("/shorts/")[1] if "/shorts/" in href else href.split("=")[1]

            # if youtuber.last_upload != result["video_id"]:
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

            # if Video.objects.filter(video_id=result["video_id"]).exists():

            #     current = Video.objects.get(video_id=result["video_id"])

            #     result["title"]    = latest.get_attribute("title")
            #     result["youtuber"] = youtuber.username

            #     driver.get(f"https://youtube.com/watch?v={result['video_id']}")
                # datetext = driver.find_element(By.ID, "info-strings").text
                # result["date"] = datetime.strptime(datetext.split("Premiered ")[-1], "%b %d, %Y")

            #     current = Video(
            #             video_id=result["video_id"],
            #             title=result["title"],
            #             date=result["date"],
            #             youtuber=Youtuber.objects.get(username=result["youtuber"]),
            #     )
            #     current.save()

                # print(youtuber.name, result["title"], result["date"])
            # else:
            #     print("no such video")
        except Exception as e:
            print(f"ERROR: {e} ({youtuber})")

    driver.quit()


class Command(BaseCommand):
    help = "Check youtube.com for latest upload from each Youtuber"    
    # define logic of command
    def handle(self, *args, **options):
        scrape()
        self.stdout.write( 'job complete' )