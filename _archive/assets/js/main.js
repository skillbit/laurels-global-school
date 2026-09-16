(function(){
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if(menuBtn && mobileMenu){
    menuBtn.addEventListener('click', function(){
      var isHidden = mobileMenu.hasAttribute('hidden');
      if(isHidden){ mobileMenu.removeAttribute('hidden'); menuBtn.setAttribute('aria-expanded','true'); }
      else { mobileMenu.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); }
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileMenu.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); });
    });
  }

  // Mark the current page's nav link active
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlink').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === here){ a.classList.add('active'); }
  });

  // Formspree enquiry form — progressive enhancement (works without JS via normal POST too)
  var form = document.querySelector('form[data-formspree]');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var submitBtn = form.querySelector('button[type="submit"]');
      var data = new FormData(form);
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(res){
        if(res.ok){
          status.textContent = "Thank you — we've received your enquiry and will get back to you soon.";
          status.className = 'form-status ok';
          form.reset();
        } else {
          status.textContent = 'Something went wrong sending this. Please call the office instead.';
          status.className = 'form-status err';
        }
      }).catch(function(){
        status.textContent = 'Something went wrong sending this. Please call the office instead.';
        status.className = 'form-status err';
      }).finally(function(){
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Send Enquiry'; }
      });
    });
  }
})();
