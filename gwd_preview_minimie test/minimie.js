// === MASK LINK SCRIPT for GWD (original + extra pairs) ===
// Pairs:
//   1) flip           -> world                     (#windowMask)
//   2) flip2          -> world2 / word2            (#windowMask2)
//   3) flip2_1/flip-1 -> world2_1 / word_1/world_1 (#windowMask3)
//   4) flip2_2/flip-2 -> world2_2 / word_2/world_2 (#windowMask4)
//   5) flip2_3/flip-3 -> world2_3 / word_3/world_3 (#windowMask5)
// Note: HTML id values shouldn't contain spaces, but this tolerates e.g. "flip 2_2" / "flip 2_3" if present.

(function() {
  // ---------- ORIGINAL (unchanged) ----------
  function syncMask() {
    var stage  = document.getElementById('pagedeck') || document.body; // fallback
    var flip   = document.getElementById('flip');
    var world  = document.getElementById('world');

    if (!stage || !flip || !world) {
      console.warn('[Mask] Missing #flip or #world element.');
      return;
    }

    if (!document.getElementById('windowMask')) {
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', 0);
      svg.setAttribute('height', 0);
      svg.style.position = 'absolute';

      var defs = document.createElementNS(svgNS, 'defs');
      var mask = document.createElementNS(svgNS, 'mask');
      mask.setAttribute('id', 'windowMask');
      mask.setAttribute('maskUnits', 'userSpaceOnUse');

      var bg = document.createElementNS(svgNS, 'rect');
      bg.setAttribute('id', 'maskBg');
      bg.setAttribute('fill', 'black');

      var hole = document.createElementNS(svgNS, 'rect');
      hole.setAttribute('id', 'maskHole');
      hole.setAttribute('fill', 'white');

      mask.appendChild(bg);
      mask.appendChild(hole);
      defs.appendChild(mask);
      svg.appendChild(defs);
      document.body.appendChild(svg);

      world.style.mask = 'url(#windowMask)';
      world.style.webkitMask = 'url(#windowMask)';
    }

    var maskBg = document.getElementById('maskBg');
    var maskHole = document.getElementById('maskHole');
    var s = (document.getElementById('pagedeck') || document.body).getBoundingClientRect();
    var r = flip.getBoundingClientRect();

    maskBg.setAttribute('x', 0);
    maskBg.setAttribute('y', 0);
    maskBg.setAttribute('width',  s.width);
    maskBg.setAttribute('height', s.height);

    maskHole.setAttribute('x', r.left - s.left);
    maskHole.setAttribute('y', r.top  - s.top);
    maskHole.setAttribute('width',  r.width);
    maskHole.setAttribute('height', r.height);

    var br = parseFloat(getComputedStyle(flip).borderTopLeftRadius) || 0;
    maskHole.setAttribute('rx', br);
    maskHole.setAttribute('ry', br);
  }

  // ---------- HELPERS ----------
  function firstById(ids) {
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      if (!id) continue;
      var el = document.getElementById(id);
      if (el) return el;
    }
    return null;
  }

  function createOrUpdateMask(stage, flipEl, worldEl, maskId) {
    if (!flipEl || !worldEl) return;
    var maskBg, maskHole;

    if (!document.getElementById(maskId)) {
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', 0);
      svg.setAttribute('height', 0);
      svg.style.position = 'absolute';

      var defs = document.createElementNS(svgNS, 'defs');
      var mask = document.createElementNS(svgNS, 'mask');
      mask.setAttribute('id', maskId);
      mask.setAttribute('maskUnits', 'userSpaceOnUse');

      maskBg = document.createElementNS(svgNS, 'rect');
      maskBg.setAttribute('id', maskId + '_bg');
      maskBg.setAttribute('fill', 'black');

      maskHole = document.createElementNS(svgNS, 'rect');
      maskHole.setAttribute('id', maskId + '_hole');
      maskHole.setAttribute('fill', 'white');

      mask.appendChild(maskBg);
      mask.appendChild(maskHole);
      defs.appendChild(mask);
      svg.appendChild(defs);
      document.body.appendChild(svg);

      worldEl.style.mask = 'url(#' + maskId + ')';
      worldEl.style.webkitMask = 'url(#' + maskId + ')';
    } else {
      maskBg = document.getElementById(maskId + '_bg');
      maskHole = document.getElementById(maskId + '_hole');
    }

    var s = stage.getBoundingClientRect();
    var r = flipEl.getBoundingClientRect();

    maskBg.setAttribute('x', 0);
    maskBg.setAttribute('y', 0);
    maskBg.setAttribute('width',  s.width);
    maskBg.setAttribute('height', s.height);

    maskHole.setAttribute('x', r.left - s.left);
    maskHole.setAttribute('y', r.top  - s.top);
    maskHole.setAttribute('width',  r.width);
    maskHole.setAttribute('height', r.height);

    var br = parseFloat(getComputedStyle(flipEl).borderTopLeftRadius) || 0;
    maskHole.setAttribute('rx', br);
    maskHole.setAttribute('ry', br);
  }

  // ---------- EXTRA PAIRS ----------
  function syncExtraPairs() {
    var stage = document.getElementById('pagedeck') || document.body;

    // Pair 2: flip2 -> world2 (or word2)
    var flip2  = firstById(['flip2']);
    var world2 = firstById(['world2', 'word2']);
    if (flip2 && world2) createOrUpdateMask(stage, flip2, world2, 'windowMask2');

    // Pair 3: flip2_1 / flip-1 -> world2_1 / word_1 / world_1
    var flip21  = firstById(['flip2_1', 'flip-1']);
    var world21 = firstById(['world2_1', 'word_1', 'world_1']);
    if (flip21 && world21) createOrUpdateMask(stage, flip21, world21, 'windowMask3');

    // Pair 4: flip2_2 / flip-2 (/ "flip 2_2" tolerated) -> world2_2 / word_2 / world_2
    var flip22  = firstById(['flip2_2', 'flip-2', 'flip 2_2']);
    var world22 = firstById(['world2_2', 'word_2', 'world_2']);
    if (flip22 && world22) createOrUpdateMask(stage, flip22, world22, 'windowMask4');

    // Pair 5: flip2_3 / flip-3 (/ "flip 2_3" tolerated) -> world2_3 / word_3 / world_3
    var flip23  = firstById(['flip2_3', 'flip-3', 'flip 2_3']);
    var world23 = firstById(['world2_3', 'word_3', 'world_3']);
    if (flip23 && world23) createOrUpdateMask(stage, flip23, world23, 'windowMask5');
  }

  function syncAll() {
    syncMask();       // original pair
    syncExtraPairs(); // added pairs
  }

  window.addEventListener('load',   syncAll);
  window.addEventListener('resize', syncAll);
  setTimeout(syncAll, 100);
})();
