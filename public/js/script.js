document.getElementById('apply-filter').addEventListener('click',function(){
    let filterString = document.querySelector('#selectFilter').value;
    location.href = `/reg_numbers/${filterString}`;
});

