// Set your API key here
const APIKEY = 'ckey_4dab9858382a4ce49155d5bfbc2';


function getData() {
    // Get key HTML elements and reset table content
    const ul = document.getElementById('metadata');
    const spinner = document.getElementById("spinner");
    const total = document.getElementById("total");
    const tableRef = document.getElementById('tokenTable').getElementsByTagName('tbody')[0];
    tableRef.innerHTML = "";
    ul.innerHTML = "";
    total.innerHTML = "";
    spinner.classList.add("show");

    // Covalent API request setup
    const address = document.getElementById('address').value || 'demo.eth';
    const chainId = document.getElementById('chain').value;
    const nft = true;
    const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=${nft}&key=${APIKEY}`);

    // Use Fetch API to get Covalent data
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        spinner.classList.remove("show");
        const tokens = data.data.items;
        let nft_count = 0;
        // Update wallet metadata
        const date = data.data.updated_at.slice(0,10)
        const time = data.data.updated_at.slice(11,19)
        ul.innerHTML = 
            `<li> Wallet address: ${data.data.address} </li>` +
            `<li> Last update: ${date} ${time} UTC </li>`;
        ;
        // Map through each token and if a NFT, populate the table
        return tokens.map(function(token) { 
        if (token.nft_data) {
            console.log(token);
            nft_count += 1;
            token.nft_data.forEach(function(nft) {
                tableRef.insertRow().innerHTML = 
                `<td><img src=${nft.external_data.image} style=width:100px;height:100px;></td>` +
                `<td> ${nft.token_id} </td>` +
                `<td> ${nft.external_data.name} </td>` +
                `<td><a href=${nft.external_data.external_url} target='_blank'>More Details</a> </td>`;
            });
        }
        total.innerHTML = `Total NFTs: ${nft_count}`
        })
    })
}


