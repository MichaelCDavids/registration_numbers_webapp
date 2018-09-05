document.getElementById('selectFilter').addEventListener('change', function () {
  let filterString = document.querySelector('#selectFilter').value
  location.href = `/reg_numbers/${filterString}`
})
