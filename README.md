# api-2fa-nodejs-gsm
API for 2FA using GSM USB (800c CHIP) in NodeJS.

**How to get a USB GSM with 800c CHIP?**
1. Buy it from Aliexpress: https://pt.aliexpress.com/item/4000890352364.html
2. Insert the **SIM Card** into the **USB GSM**.

**Installation:**
1. Download the master branch.
2. Install **NodeJs v18.6** or superior version.
3. Run *npm install*
4. Plug the *USB GSM 800c* into your **Host Device**.
5. Change **all the needed details** inside *config.json*. (*Including the **seriaportid** and **pincode** paramter*)
6. Run *node index.js*

**Usage:**
1. Wait for the SMS recieved into the number (*numberowner*) you setted in the *config.json* file.
2. Send a request to `http://127.0.0.1:PORT/?apikey=APIKEY&number=NUMBER&code=CODE`

**Variables:**
1. **PORT:** is the Port you have your API listened on. (*Ex: 5013* | *Note this is the default port, you may change it*)
2. **APIKEY:** is the API Key you setted in **config.json**.
3. **NUMBER:** is the user number **without** the country code. (*Ex: 910000000*)
4. **CODE:** is the **code** for verification in the Website.
