# For Developers - EscrowMyEther Buyer Dashboard

This repo is for developers who are looking to integrate EscrowMyEther on their site. This repo is just for buyer dashboard. (Seller dashboard repo will be up soon)




## Getting Started

This repo is hosted on github pages: https://escrowmyetherbd.github.io/

There are several ways to integrate the buyer dashboard in your site. The easiest way is cloning this repository on github and running it on github pages, and replacing the github.io domain with your subdomain (dashboard.yoursite.com).
For more info on setting up github pages, visit: https://pages.github.com/

EscrowMyEther is a static html/css/javascript/ReactJS site and a client-side interface to the escrow smart contract. No special hosting environment is required if you choose to copy the repo and run it on your site.

## Modifying for your own usage - Get started

1)	Copy the "Source Files" folder
2)	Download node_modules.zip from this link: https://drive.google.com/open?id=0By0DAad8QzZAUjBDQ1VJQmZieTg
3)  Copy the extracted folder into "Source Files" folder
4)	Install NodeJS. v8.1.4 is recommended as it's used in the development of this Dapp.
5)  You can then modify the Dapp for your usage. The below commands will be helpful.

npm start - Start a local version of the Dapp in your browser localhost:3000. It automatically reloads the Dapp when you save any updates to the source files. Useful during development.

npm run build - Build an optimized version for deployment. A new folder called build_webpack will be created with the optimized version. You can upload the content of build_webpack directly to github pages for deployment.

## Layout of source files

### Public > Index.html
Content of the Dapp is served between <div id="root"></div>. Any content added above this root div will show above the Dapp, like a header. Any content added below will display like a footer.

### src > Index.css
Css file for modifying styles.

### src > BuyerHome.js
The buyer dashboard page you see when visiting https://escrowmyetherbd.github.io/

### src > NewTransactionRS.js
When you click "Initialize new transaction" on the dashboard, the right side changes to this page. This page should be modified if you wish to hardcode your address as the escrow agent or seller.




## Adding your header & footer

Under Public > Index.html, the Dapp is rendered within <div id="root"></div>. Custom header and footers can be added above and below this div.


## Hardcoding Escrow Agent address
If you look to be the escrow agent for your site (example: Real estate agents, classified sites), you can remove the escrow agent input field and hardcode your address as the escrow agent.

To do this, 

1) Open Source Files > src > NewTransactionRS.js.

2) Hardcode your address. In line 306, replace this.state.escrowAddress with your own address as follows:
![Orignal](https://user-images.githubusercontent.com/24837709/32013863-fb55a59a-b9ee-11e7-867b-437a1f67526f.png)

![New](https://user-images.githubusercontent.com/24837709/32013861-fb290e9a-b9ee-11e7-8754-fa4f7cdca610.png)

3) Remove the Escrow Address input field

Line 425 to 434 and 368 to 377 contains the Escrow Address input field. Remove both of them.

![Remove] (https://user-images.githubusercontent.com/24837709/32030707-6ec46738-ba2f-11e7-8fe3-5dd84c7a6181.png)



## Authors

Cheung Ka Yin 
escrowmyether[at]gmail[dot]com

