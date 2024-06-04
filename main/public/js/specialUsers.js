document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.horizontal-scroll').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const targetOffset = targetElement.offsetLeft;

            window.scroll({
                left: targetOffset,
                behavior: 'smooth'
            });
        });
    });
});