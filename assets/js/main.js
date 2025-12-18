/*
	ZeroFour by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

  // Brand assets (place the provided logo image here).
  // Note: This repo is static; we cannot generate binary images here.
  // Logo file used site-wide
  var BRAND = {
    logo: 'images/logo.jpeg'
  };

  function applyBranding() {
    var $logoLink = $('#logo');
    if ($logoLink.length) {
      // Update <picture> sources if present.
      var $picture = $logoLink.find('picture');
      if ($picture.length) {
        $picture.find('source').each(function() {
          $(this).attr('srcset', BRAND.logo);
        });
        $picture.find('img').each(function() {
          $(this)
            .attr('src', BRAND.logo)
            .attr('alt', 'Five Borough Door Solutions logo');
        });
      } else {
        // Fallback: update <img> directly.
        $logoLink.find('img').each(function() {
          $(this)
            .attr('src', BRAND.logo)
            .attr('alt', 'Five Borough Door Solutions logo');
        });
      }
    }

    // Force consistent logo size (overrides many inline <style> blocks).
    function setLogoSize() {
      var isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
      var heightPx = isMobile ? 60 : 100;
      var logoImg = document.querySelector('#logo img');
      if (logoImg) {
        logoImg.style.height = heightPx + 'px';
        logoImg.style.width = 'auto';
        logoImg.style.mixBlendMode = 'lighten';
      }
    }
    setLogoSize();
    $window.on('resize', setLogoSize);
  }

  // Allow other scripts/late-loaded HTML fragments to re-apply branding.
  window.__applyFbdBranding = applyBranding;

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

  // Apply brand logo early so the mobile title bar uses it.
  applyBranding();

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			offsetY: -22,
			mode: 'fade',
			noOpenerFade: true,
			speed: 300,
			detach: false
		});

	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);

let lastETACheck = 0;
let cachedETA = null;
const ETA_CACHE_DURATION = 8 * 60 * 1000; // 8 minutes

function updateProgressBar(progress) {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}%`;
}

function checkTechnicianETA() {
  // Hide the check button and show the ETA container
  document.getElementById('check-button-container').style.display = 'none';
  document.getElementById('tech-eta-container').style.display = 'block';
  // Show loading spinner, hide technician status
  document.getElementById('eta-spinner').style.display = 'block';
  document.getElementById('tech-status').style.display = 'none';

  // Reset progress bar
  updateProgressBar(0);

  const startTime = Date.now();
  const duration = 10000; // 10 seconds

  function updateETA() {
    const currentTime = Date.now();
    // Generate new ETA if cache expired
    if (!cachedETA || (currentTime - lastETACheck) > ETA_CACHE_DURATION) {
      cachedETA = Math.floor(Math.random() * (30 - 22 + 1)) + 22;
      lastETACheck = currentTime;
    }
    // Hide loading spinner and show technician status
    document.getElementById('eta-spinner').style.display = 'none';
    document.getElementById('tech-status').style.display = 'flex';

    const techStatus = document.getElementById('tech-status');
    techStatus.innerHTML = `
      <div class="tech-icon">
		<i class="fas fa-truck" style="font-size: 24px; color: #0b1f3b; margin-right: 10px;"></i>
      </div>
	  <span style="font-size: 1.1em; color: #0b1f3b;">
        <strong>Technician Available:</strong> Estimated arrival time - ${cachedETA} minutes
      </span>
    `;
  }

  function updateProgress() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = (elapsed / duration) * 100;
    if (progress < 100) {
      updateProgressBar(progress);
      requestAnimationFrame(updateProgress);
    } else {
      updateProgressBar(100);
      updateETA();
    }
  }

  requestAnimationFrame(updateProgress);
}

			document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('navbar1');
    if (footerContainer) {
        fetch('navbar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
              footerContainer.innerHTML = data;
              if (window.__applyFbdBranding) window.__applyFbdBranding();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});