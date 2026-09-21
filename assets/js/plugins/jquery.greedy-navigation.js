/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav > .nav-toggle');
var $vlinks = $('#site-nav .visible-links');
var $vlinks_persist_tail = $vlinks.children(".persist").not(".masthead__menu-item--lg").first();
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];

function updateNav() {

  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;

  // The visible list is overflowing the nav
  if ($vlinks.width() > availableSpace) {

    while ($vlinks.width() > availableSpace && $vlinks.children("*:not(.persist)").length > 0) {
      // Record the width of the list
      breaks.push($vlinks.width());

      // Move item to the hidden list
      $vlinks.children("*:not(.persist)").last().prependTo($hlinks);

      // Show the dropdown btn
      $btn.removeClass("hidden");
      availableSpace = $nav.width() - $btn.width() - 30;
    }

    // The visible list is not overflowing
  } else {

    // There is space for another item in the nav
    while (breaks.length > 0) {
      // Move the item to the visible list
      var $candidate = $hlinks.children().first();
      if ($vlinks_persist_tail.length > 0) {
        $candidate.insertBefore($vlinks_persist_tail);
      } else {
        $candidate.appendTo($vlinks);
      }
      // Brand wrapping and font sizes can change since this item was hidden.
      var candidateSpace = $hlinks.children().length === 0 ? $nav.width() : availableSpace;
      if ($vlinks.width() > candidateSpace) {
        $candidate.prependTo($hlinks);
        break;
      }
      breaks.pop();
    }

    // Hide the dropdown btn if hidden list is empty
    if (breaks.length < 1) {
      $btn.addClass('hidden');
      $btn.removeClass('close');
      $hlinks.addClass('hidden');
    }
  }

  // Keep counter updated
  $btn.attr("count", breaks.length);
  $btn.attr("aria-expanded", !$hlinks.hasClass("hidden"));
  $hlinks.attr("aria-hidden", $hlinks.hasClass("hidden"));

  // Share the actual header height with the body offset and sticky sidebar.
  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  document.documentElement.style.setProperty('--masthead-height', mastheadHeight + 'px');

}

// Window listeners

$(window).on('resize', function () {
  updateNav();
});
if (screen.orientation) screen.orientation.addEventListener("change", function () {
  updateNav();
});

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
  $btn.attr('aria-expanded', !$hlinks.hasClass('hidden'));
  $hlinks.attr('aria-hidden', $hlinks.hasClass('hidden'));
});

updateNav();
$nav.on('keydown', function (event) {
  if (event.key === 'Escape') {
    $hlinks.addClass('hidden').attr('aria-hidden', 'true');
    $btn.removeClass('close').attr('aria-expanded', 'false').trigger('focus');
  }
});

$(window).on("load", updateNav);
if (document.fonts) document.fonts.addEventListener("loadingdone", updateNav);
