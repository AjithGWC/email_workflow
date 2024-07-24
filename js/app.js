domo.get("/domo/users/v1?includeDetails=true&limit=200").then(function(data){
    // console.log(data);
    const selectBox = document.getElementById('users');

    data.forEach(function(items){
        if(items.id == domo.env.userId){
            document.getElementById('name').innerHTML = "Hello " + items.displayName + " !!";
        }
        // if(items.id == '1789040228' || items.id == '1331599280' || items.id == '653567171' || 
        //     items.id == '788642721' || items.id == '38266541' || items.id == '167977994' || items.id == '1129963338'){
            let optionElement = document.createElement('option'); 
            optionElement.value = items.detail.email;
            optionElement.textContent = items.displayName;
            selectBox.appendChild(optionElement);
        // }
    });
});

let send_email = document.getElementById('send-email');
send_email.addEventListener('click', SendEmailLoop);

function SendEmailLoop(){
    const selects = document.getElementById('users');
    const values = Array.from(selects.selectedOptions).map(option => option.value);
    values.forEach(
        function (personId) {
            let html = `
                <div class="h-16 mt-2 bg-green-100 w-64 border border-green-400 px-4 py-3 rounded relative hide" role="alerts" style="top:35%;">
                    <strong class="mt-2 font-bold">${personId}</strong>
                    <span class="absolute top-0 bottom-0 right-0" id="close_${personId}">
                    <svg class="fill-current ml-5 h-6 w-6 text-black" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </div>
            `;
            console.log('fsd');
            let alerts = document.getElementById('alert');
            alerts.innerHTML += html;
            alerts.style.display = 'block';

            let closeButton = document.getElementById(`close_${personId}`);
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    alerts.style.display = 'none';
                });
            }
            SendEmail(to = personId)
        }
    )
};

function SendEmail(to) {
    // console.log(to);

    async function startWorkflow(alias, body) {
        console.log(to);
        const response = await domo.post(`/domo/workflow/v1/models/${alias}/start`, body);
    }
    body = document.getElementById('body').value;
    subject = document.getElementById('subject').value;
    
    if(body == ''){
        alert('Body cannot be empty');
    }else if(subject == ''){
        alert('Subject cannot be empty');
    }else{
        startWorkflow("send_email", { to: to, subject: subject, body: body });
    }
}

