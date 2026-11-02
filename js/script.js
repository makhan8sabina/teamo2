$(document).ready(function(){
console.log("jQuery is ready!");
});
//7
var TeamoUI = (function ($) {
  'use strict';

  var ICONS = { success: '✓', error: '!', info: 'i', warning: '!' };

  function toast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3200;

    var $box = $('#jq-toasts');
    if (!$box.length) {
      $box = $('<div id="jq-toasts" aria-live="polite"></div>').appendTo('body');
    }
    while ($box.children().length >= 4) {
      $box.children().first().remove();
    }

    var $t = $('<div class="jq-toast" role="status"></div>')
      .addClass('jq-toast-' + type)
      .append($('<span class="jq-toast-icon" aria-hidden="true"></span>').text(ICONS[type] || 'i'))
      .append($('<span class="jq-toast-msg"></span>').text(message))
      .append('<button type="button" class="jq-toast-close" aria-label="Dismiss notification">&times;</button>')
      .hide()
      .appendTo($box)
      .fadeIn(250);

    var timer = setTimeout(dismiss, duration);
    function dismiss() {
      clearTimeout(timer);
      $t.stop(true, true).fadeOut(400, function () { $(this).remove(); });
    }
    $t.find('.jq-toast-close').on('click', dismiss);
  }

//6
  function setLoading($btn, loading) {
    if (loading) {
      if ($btn.data('orig-html') === undefined) {
        $btn.data('orig-html', $btn.html());
      }
      $btn.prop('disabled', true)
          .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');
    } else {
      if ($btn.data('orig-html') !== undefined) {
        $btn.html($btn.data('orig-html')).removeData('orig-html');
      }
      $btn.prop('disabled', false);
    }
  }

  return { toast: toast, setLoading: setLoading };
})(jQuery);


(function ($) {
  'use strict';

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

//3
  function highlight($roots, q) {
    // remove old highlights first
    $roots.find('mark.jq-hl').each(function () {
      $(this).replaceWith(document.createTextNode($(this).text()));
    });
    $roots.each(function () { this.normalize(); });
    if (!q) return;

    var re = new RegExp(escapeRegExp(q), 'gi');
    var textNodes = [];

    function walk(node) {
      $(node).contents().each(function () {
        if (this.nodeType === 3) {
          if ((this.nodeValue).trim() !== '') textNodes.push(this);
        } else if (this.nodeType === 1 && this.nodeName !== 'MARK') {
          walk(this);
        }
      });
    }
    $roots.each(function () { walk(this); });

    $.each(textNodes, function (_, node) {
      var text = node.nodeValue, m, found = [];
      re.lastIndex = 0;
      while ((m = re.exec(text)) !== null) {
        found.push({ index: m.index, length: m[0].length });
        if (m[0].length === 0) re.lastIndex++;
      }
      // go from the end so earlier indexes stay valid
      for (var k = found.length - 1; k >= 0; k--) {
        var mid = node.splitText(found[k].index);
        mid.splitText(found[k].length);
        $(mid).wrap('<mark class="jq-hl"></mark>');
      }
    });
  }

//1-2
  function initSearch(cfg) {
    var $input = $(cfg.input);
    if (!$input.length) return null;

    var $list = $(cfg.suggest);
    var $count = $(cfg.count);
    var activeIdx = -1;
    var lastVal = null;

    function query() { return ($input.val()).trim(); }

 //1
    function apply() {
      var q = query();
      var ql = q.toLowerCase();
      var $items = cfg.items();

      var $matched = $items.filter(function () {
        return !ql || $(this).text().toLowerCase().indexOf(ql) > -1;
      });
      $items.not($matched).hide();
      $matched.show();

      $items.each(function () { highlight(cfg.targets($(this)), q); });

      if (cfg.onApply) cfg.onApply(q, $items, $matched);

      if (q) {
        $count.text($matched.length + (cfg.noun || ' result') +
          ($matched.length === 1 ? '' : 's') + ' for “' + q + '”');
      } else {
        $count.text('');
      }
    }

//2
    function hideSuggest() {
      $list.prop('hidden', true).empty();
      $input.attr('aria-expanded', 'false');
      activeIdx = -1;
    }

    function renderSuggest() {
      var q = query();
      var ql = q.toLowerCase();
      $list.empty();
      activeIdx = -1;
      if (!ql) { hideSuggest(); return; }

      var hits = $.grep(cfg.suggestions(), function (s) {
        var sl = s.toLowerCase();
        return sl.indexOf(ql) > -1 && sl !== ql;
      }).slice(0, 6);

      if (!hits.length) { hideSuggest(); return; }

      $.each(hits, function (i, s) {
        var $li = $('<li class="list-group-item list-group-item-action jq-suggest-item" role="option"></li>')
          .attr('data-value', s)
          .text(s);
        highlight($li, q);
        $list.append($li);
      });
      $list.prop('hidden', false);
      $input.attr('aria-expanded', 'true');
    }

    function choose(value) {
      $input.val(value);
      lastVal = value;
      hideSuggest();
      apply();
    }

    function setActive(idx) {
      var $items = $list.children();
      $items.removeClass('jq-active').attr('aria-selected', 'false');
      if (idx > -1) {
        var el = $items.eq(idx).addClass('jq-active').attr('aria-selected', 'true')[0];
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
      }
      activeIdx = idx;
    }

    function onChange() {
      var v = $input.val();
      if (v === lastVal) return;
      lastVal = v;
      apply();
      renderSuggest();
    }

    $input.attr({ role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': 'false' });
    $input.on('keyup input search', onChange);

    $input.on('keydown', function (e) {
      var n = $list.children().length;
      if ($list.prop('hidden') || !n) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((activeIdx + 1) % n);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((activeIdx - 1 + n) % n);
      } else if (e.key === 'Enter' && activeIdx > -1) {
        e.preventDefault();
        choose($list.children().eq(activeIdx).attr('data-value'));
      } else if (e.key === 'Escape') {
        hideSuggest();
      }
    });


    $list.on('mousedown', '.jq-suggest-item', function (e) {
      e.preventDefault();
      choose($(this).attr('data-value'));
    });
    $list.on('mouseenter', '.jq-suggest-item', function () {
      setActive($(this).index());
    });

    $input.on('focus', function () { if (query()) renderSuggest(); });
    $input.on('blur', hideSuggest);

    return { apply: apply };
  }


  function initEventSearch() {
    var api = initSearch({
      input: '#eventSearch',
      suggest: '#eventSuggest',
      count: '#eventSearchCount',
      noun: ' event',
      items: function () { return $('#schedule tbody tr').not('.jq-empty'); },
      targets: function ($row) { return $row.children('td'); },
      suggestions: function () {
        var seen = {}, out = [];
        var list = (typeof events !== 'undefined') ? events : [];   // `events` comes from schedule.js
        $.each(list, function (_, ev) {
          $.each([ev.name, ev.place, ev.format], function (_, val) {
            if (val && !seen[val]) { seen[val] = true; out.push(val); }
          });
        });
        return out;
      },
      onApply: function (q, $items, $matched) {
        var $body = $('#schedule tbody');
        $body.find('.jq-empty').remove();
        if (q && !$matched.length) {
          var $row = $('<tr class="jq-empty"><td colspan="4" class="text-center text-body-secondary py-3"></td></tr>');
          $row.find('td').text('No events match “' + q + '”.');
          $body.append($row);
        }
      }
    });


    if (api) $('[data-filter]').on('click', api.apply);
  }

  function initFaqSearch() {
    initSearch({
      input: '#faqSearch',
      suggest: '#faqSuggest',
      count: '#faqSearchCount',
      noun: ' question',
      items: function () { return $('.faq-item'); },
      targets: function ($item) {
        return $item.find('.faq-question > span:first-child, .faq-answer p');
      },
      suggestions: function () {
        return $('.faq-question > span:first-child').map(function () {
          return ($(this).text()).trim();
        }).get();
      },
      onApply: function (q, $items, $matched) {
        var ql = q.toLowerCase();

        $items.each(function () {
          var $item = $(this);
          var $answer = $item.find('.faq-answer');
          var $icon = $item.find('.faq-icon');
          var open = ql && $matched.is(this) &&
            $answer.text().toLowerCase().indexOf(ql) > -1;
          $answer.css('max-height', open ? $answer[0].scrollHeight + 'px' : '0px');
          $icon.text(open ? '-' : '+');
        });

        var $empty = $('#faqEmpty');
        if (!$empty.length) {
          $empty = $('<p id="faqEmpty" class="text-center text-body-secondary py-3 mb-0"></p>')
            .insertAfter($items.last());
        }
        if (q && !$matched.length) {
          $empty.text('No questions match “' + q + '”.').show();
        } else {
          $empty.hide();
        }
      }
    });
  }

//4
  function initProgressBar() {
    $('<div id="jq-progress" role="progressbar" aria-label="Page scroll progress" ' +
      'aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>').appendTo('body');
  }

  function updateProgress() {
    var max = $(document).height() - $(window).height();
    var pct = max > 0 ? Math.min(100, ($(window).scrollTop() / max) * 100) : 0;
    $('#jq-progress').css('width', pct + '%').attr('aria-valuenow', Math.round(pct));
  }

//5
  function formatNumber(n) { return n.toLocaleString('en-US'); }

  function startCounter($el) {
    var target = Number($el.attr('data-target')) || 0;
    var suffix = $el.attr('data-suffix') || '';
    $({ value: 0 }).animate({ value: target }, {
      duration: 1800,
      easing: 'swing',
      step: function (now) { $el.text(formatNumber(Math.floor(now)) + suffix); },
      complete: function () { $el.text(formatNumber(target) + suffix); }
    });
  }

  function initCounters() {
    $('.jq-counter').each(function () {
      $(this).text('0' + ($(this).attr('data-suffix') || ''));
    });
  }

  function isInView($el, buffer) {
    var top = $(window).scrollTop();
    var bottom = top + $(window).height();
    var elTop = $el.offset().top;
    var elBottom = elTop + $el.outerHeight();
    buffer = buffer || 0;
    return elBottom > top - buffer && elTop < bottom + buffer;
  }

  function checkCounters() {
    $('.jq-counter').not('.jq-counted').each(function () {
      var $el = $(this);
      if (isInView($el)) {
        $el.addClass('jq-counted');
        startCounter($el);
      }
    });
  }

//8
  var ICON_COPY =
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">' +
    '<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>' +
    '<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>';
  var ICON_CHECK =
    '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
    '<path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var $tmp = $('<textarea readonly></textarea>')
        .css({ position: 'fixed', top: 0, left: 0, opacity: 0 })
        .val(text)
        .appendTo('body');
      $tmp[0].select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      $tmp.remove();
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  function initCopyButtons() {
    $('.jq-copy-btn .jq-copy-icon').html(ICON_COPY);

    $(document).on('click', '.jq-copy-btn', function () {
      var $btn = $(this);
      if ($btn.data('busy')) return;

      var text = ($btn.closest('.jq-snippet').find('.jq-snippet-text').text()).trim();
      copyText(text).then(function () {
        $btn.data('busy', true).addClass('is-copied');
        $btn.find('.jq-copy-icon').html(ICON_CHECK);

        var $tip = $('<span class="jq-tooltip" role="status">Copied to clipboard!</span>')
          .hide().appendTo($btn).fadeIn(150);

        setTimeout(function () {
          $tip.fadeOut(200, function () { $(this).remove(); });
          $btn.removeClass('is-copied');
          $btn.find('.jq-copy-icon').html(ICON_COPY);
          $btn.data('busy', false);
        }, 1800);
      }, function () {
        TeamoUI.toast('Could not copy. Please copy it manually.', 'error');
      });
    });
  }

//9
  function initLazy() {
    $('img[data-src]').addClass('jq-lazy');
  }

  function loadLazyImages() {
    $('img.jq-lazy').each(function () {
      var $img = $(this);
      // images inside a carousel are hidden, so measure the carousel instead
      var $ref = $img.closest('.carousel');
      if (!$ref.length) $ref = $img;

      if (isInView($ref, 200)) {
        var src = $img.attr('data-src');
        $img.removeClass('jq-lazy')
            .one('load', function () { $(this).addClass('jq-loaded'); })
            .attr('src', src)
            .removeAttr('data-src');
      }
    });
  }

//7
  function initSaveButtons() {
    $('.jq-save').on('click', function () {
      var $btn = $(this);
      var saved = !$btn.hasClass('is-saved');
      var name = $btn.attr('data-event');
      $btn.toggleClass('is-saved', saved)
          .attr('aria-pressed', saved)
          .text(saved ? '★ Saved' : '☆ Save');
      TeamoUI.toast(saved ? '“' + name + '” saved to your list' : '“' + name + '” removed from your list',
                    saved ? 'success' : 'info');
    });
  }

  function initThemeToast() {
    $('#theme-toggle').on('click', function () {
      setTimeout(function () {
        var dark = $('body').hasClass('dark-theme');
        TeamoUI.toast(dark ? 'Dark mode on' : 'Light mode on', 'info', 1800);
      }, 0);
    });
  }

  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateProgress();
      checkCounters();
      loadLazyImages();
    });
  }

  $(document).ready(function () {
    console.log("jQuery is ready!");

    initEventSearch();
    initFaqSearch();
    initProgressBar();
    initCounters();
    initCopyButtons();
    initLazy();
    initSaveButtons();
    initThemeToast();

    $(window).on('scroll resize load', onScrollOrResize);
    updateProgress();
    checkCounters();
    loadLazyImages();
  });

})(jQuery);
