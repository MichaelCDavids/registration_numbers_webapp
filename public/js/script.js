document.getElementById('apply-filter').addEventListener('click',function(){
    let filterString = document.querySelector('#selectFilter').value;
    if(filterString===''||filterString===undefined){
        filterString = all;
    }
    location.href = `/reg_numbers/${filterString}`;
});

