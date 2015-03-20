import os
import shutil 
import platform


osName = platform.system()
userHome = os.path.expanduser('~') 

profilesPath = ""
if osName == "Darwin":
    profilesPath = userHome + "/Library/Application Support/Firefox/Profiles/"

userPath = os.listdir(profilesPath)[0]
scriptPath =  os.path.join(profilesPath,userPath,"gm_scripts")

count = 0
for root,dirs,files in os.walk(scriptPath):
    for name in files:
        if name.find("user.js") > 0:
            src = os.path.join(root,name)
            print ("copy file: "+ src)
            des = os.path.join("user script",name)
            shutil.copy(src,des)
            count += 1
print("-"*60)
print("Total copyed %d files" % count)
