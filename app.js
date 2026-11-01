/* ============================================================
   Motor compartido del curso MER · DER · MySQL · Dia
   - Acordeón de temas + pestañas Teoría / Ejercitación
   - Autoevaluación (opción múltiple)
   - Corrector de ejercicios (revisa estructura, no ejecuta SQL)
   - Progreso guardado en localStorage
   ============================================================ */
(function () {
    var CFG = window.GUIA || {};
    var PREFIJO = CFG.prefijo || 'guia_';
    var EJERCICIOS = CFG.ejercicios || {};
    var TEMAS = CFG.temas || [];
    var PALETA = CFG.paleta || [];
    var CLAVE = PREFIJO + 'ej_';

    /* ================= ACORDEÓN DE TEMAS + PESTAÑAS ================= */
    var articulos = document.querySelectorAll('#teoria article.card');

    articulos.forEach(function (article, index) {
        var h3 = article.querySelector('h3');
        var ejercicios = Array.prototype.slice.call(article.children).filter(function (ch) {
            return ch.classList && ch.classList.contains('exercise');
        });
        if (!h3 || !ejercicios.length) return;

        article.classList.add('topic');

        var teoria = document.createElement('div');
        teoria.className = 'topic-panel topic-panel-teoria';
        teoria.setAttribute('role', 'tabpanel');

        var practica = document.createElement('div');
        practica.className = 'topic-panel topic-panel-ejercicio';
        practica.setAttribute('role', 'tabpanel');
        practica.hidden = true;

        Array.prototype.slice.call(article.children).forEach(function (child) {
            if (child === h3 || ejercicios.indexOf(child) >= 0) return;
            teoria.appendChild(child);
        });
        ejercicios.forEach(function (ex) { practica.appendChild(ex); });

        var tabs = document.createElement('div');
        tabs.className = 'topic-tabs';
        tabs.setAttribute('role', 'tablist');
        tabs.innerHTML =
            '<button type="button" class="topic-tab active" data-tab="teoria" role="tab" aria-selected="true">📘 Teoría</button>' +
            '<button type="button" class="topic-tab" data-tab="ejercicio" role="tab" aria-selected="false">✍️ Ejercitación</button>';

        article.appendChild(teoria);
        article.appendChild(practica);
        article.insertBefore(tabs, teoria);

        h3.classList.add('topic-toggle');
        h3.setAttribute('role', 'button');
        h3.setAttribute('tabindex', '0');
        h3.setAttribute('title', 'Abrir o cerrar este tema');
        var chevron = document.createElement('span');
        chevron.className = 'chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '▾';
        h3.appendChild(chevron);

        function setTab(nombre) {
            tabs.querySelectorAll('.topic-tab').forEach(function (b) {
                var activo = b.dataset.tab === nombre;
                b.classList.toggle('active', activo);
                b.setAttribute('aria-selected', activo ? 'true' : 'false');
            });
            teoria.hidden = nombre !== 'teoria';
            practica.hidden = nombre !== 'ejercicio';
        }

        function setOpen(abierto) {
            article.classList.toggle('open', abierto);
            article.classList.toggle('closed', !abierto);
            h3.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        }

        function alternar() {
            var abrir = !article.classList.contains('open');
            if (abrir) {
                articulos.forEach(function (otro) {
                    if (otro !== article && otro._setOpen) otro._setOpen(false);
                });
            }
            setOpen(abrir);
        }

        h3.addEventListener('click', alternar);
        h3.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                alternar();
            }
        });
        tabs.addEventListener('click', function (e) {
            var btn = e.target.closest('.topic-tab');
            if (btn) setTab(btn.dataset.tab);
        });

        article._setTab = setTab;
        article._setOpen = setOpen;

        setOpen(index === 0);
        setTab('teoria');
    });

    window.abrirEjercicio = function (id) {
        var input = document.getElementById('in-' + id);
        if (!input) return;
        var article = input.closest('#teoria article.card');
        if (!article) { input.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
        document.querySelectorAll('#teoria article.card').forEach(function (otro) {
            if (otro !== article && otro._setOpen) otro._setOpen(false);
        });
        if (article._setOpen) article._setOpen(true);
        if (article._setTab) article._setTab('ejercicio');
        article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    var listaProgreso = document.getElementById('progreso-lista');
    if (listaProgreso) {
        listaProgreso.addEventListener('click', function (e) {
            var a = e.target.closest('a[href^="#in-"]');
            if (!a) return;
            e.preventDefault();
            window.abrirEjercicio(a.getAttribute('href').slice(4));
        });
    }

    /* ================= PALETA DE SÍMBOLOS ================= */
    function insertarEnTextarea(ta, texto) {
        var ini = ta.selectionStart;
        var fin = ta.selectionEnd;
        var antes = ta.value.slice(0, ini);
        var despues = ta.value.slice(fin);
        var sepAntes = (antes && !/[\s(]$/.test(antes)) ? ' ' : '';
        var sepDespues = (despues && !/^[\s,.;:)\]]/.test(despues)) ? ' ' : '';
        var insertado = sepAntes + texto + sepDespues;
        ta.value = antes + insertado + despues;
        var pos = (antes + insertado).length;
        ta.focus();
        ta.setSelectionRange(pos, pos);
        ta.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (PALETA.length) {
        var ICONOS = {
            rect: '<rect x="4" y="8" width="32" height="16" rx="2" fill="#dbeafe" stroke="currentColor" stroke-width="1.7"/>',
            rombo: '<polygon points="20,4 36,16 20,28 4,16" fill="#fff" stroke="currentColor" stroke-width="1.7"/>',
            ovalo: '<ellipse cx="20" cy="16" rx="15" ry="9" fill="#fff" stroke="currentColor" stroke-width="1.7"/>',
            'ovalo-clave': '<ellipse cx="20" cy="16" rx="15" ry="9" fill="#fff" stroke="currentColor" stroke-width="1.7"/><line x1="12" y1="21" x2="28" y2="21" stroke="currentColor" stroke-width="1.7"/>',
            'doble-ovalo': '<ellipse cx="20" cy="16" rx="16" ry="10" fill="#fff" stroke="currentColor" stroke-width="1.7"/><ellipse cx="20" cy="16" rx="11.5" ry="6.5" fill="#fff" stroke="currentColor" stroke-width="1.4"/>',
            'ovalo-punteado': '<ellipse cx="20" cy="16" rx="15" ry="9" fill="#fff" stroke="currentColor" stroke-width="1.7" stroke-dasharray="3.2 2.6"/>'
        };

        document.querySelectorAll('#teoria .exercise').forEach(function (ex) {
            var ta = ex.querySelector('textarea');
            if (!ta || ex.querySelector('.ex-paleta')) return;

            var wrap = document.createElement('div');
            wrap.className = 'ex-paleta';
            var rotulo = document.createElement('span');
            rotulo.className = 'ex-paleta-label';
            rotulo.textContent = 'Símbolos';
            wrap.appendChild(rotulo);

            PALETA.forEach(function (p) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'ex-sym';
                b.title = 'Insertar «' + p.inserta + '» en el campo';

                if (p.icono && ICONOS[p.icono]) {
                    b.innerHTML = '<svg class="ex-sym-icon" viewBox="0 0 40 32" aria-hidden="true" focusable="false">' + ICONOS[p.icono] + '</svg>' +
                        '<span class="ex-sym-name">' + p.etiqueta + '</span>';
                    b.setAttribute('aria-label', p.etiqueta);
                } else {
                    b.textContent = p.etiqueta;
                }

                b.addEventListener('click', function () { insertarEnTextarea(ta, p.inserta); });
                wrap.appendChild(b);
            });

            ta.parentNode.insertBefore(wrap, ta);
        });
    }

    /* ================= AUTOEVALUACIÓN ================= */
    document.querySelectorAll('.options-list').forEach(function (lista) {
        lista.addEventListener('click', function (e) {
            var li = e.target.closest('li');
            if (!li) return;
            var q = li.closest('.quiz-question');
            if (!q || q.dataset.locked) return;
            q.querySelectorAll('li').forEach(function (x) { x.classList.remove('selected'); });
            li.classList.add('selected');
        });
    });

    window.calificarQuiz = function (contId, bannerId) {
        var cont = document.getElementById(contId);
        if (!cont) return;
        var qs = cont.querySelectorAll('.quiz-question');
        var ok = 0, sinResponder = 0;

        qs.forEach(function (q) {
            var ans = q.dataset.answer;
            var sel = q.querySelector('li.selected');
            q.querySelectorAll('li').forEach(function (li) {
                li.classList.remove('correct', 'incorrect');
                if (li.dataset.opt === ans) li.classList.add('correct');
            });
            if (!sel) sinResponder++;
            else if (sel.dataset.opt === ans) ok++;
            else sel.classList.add('incorrect');
            q.dataset.locked = '1';
        });

        var banner = document.getElementById(bannerId);
        if (!banner) return;
        var total = qs.length;
        var pct = Math.round(ok / total * 100);
        banner.style.display = 'block';
        banner.style.background = pct >= 60 ? '#dcfce7' : '#fee2e2';
        banner.style.color = pct >= 60 ? '#14532d' : '#7f1d1d';
        banner.style.border = '1px solid ' + (pct >= 60 ? '#86efac' : '#fca5a5');
        banner.textContent = 'Resultado: ' + ok + ' / ' + total + ' (' + pct + '%)' +
            (sinResponder ? ' · ' + sinResponder + ' sin responder' : '');
    };

    window.reiniciarQuiz = function (contId, bannerId) {
        var cont = document.getElementById(contId);
        if (!cont) return;
        cont.querySelectorAll('.quiz-question').forEach(function (q) {
            delete q.dataset.locked;
            q.querySelectorAll('li').forEach(function (li) {
                li.classList.remove('selected', 'correct', 'incorrect');
            });
        });
        var banner = document.getElementById(bannerId);
        if (banner) { banner.style.display = 'none'; banner.textContent = ''; }
    };

    /* ================= CORRECTOR ================= */
    function norm(txt) {
        return txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[▭▬■□◻]/g, ' rectangulo ')
            .replace(/[◇◆♦]/g, ' rombo ')
            .replace(/[⬭⬮○◯]/g, ' ovalo ')
            .toLowerCase()
            .replace(/--[^\n]*/g, '')
            .replace(/#[^\n]*/g, '')
            .replace(/[ \t]+/g, ' ')
            .trim();
    }
    function count(c, re) {
        var g = new RegExp(re.source, 'g');
        return (c.match(g) || []).length;
    }

    window.corregir = function (id) {
        var checks = EJERCICIOS[id];
        var input = document.getElementById('in-' + id);
        var res = document.getElementById('res-' + id);
        if (!checks || !input || !res) return;

        var code = norm(input.value);
        res.classList.add('show');

        if (!code) {
            res.innerHTML = '<p class="result-msg" style="color:#b91c1c;">⚠️ Escribí tu solución antes de corregir.</p>';
            return;
        }

        var ok = 0;
        var items = checks.map(function (ch) {
            var passed = false;
            try { passed = ch.f(code); } catch (e) { passed = false; }
            if (passed) ok++;
            return '<li class="' + (passed ? 'ok' : 'fail') + '">' +
                (passed ? '✔' : '✘') + ' ' + ch.d + '</li>';
        }).join('');

        var total = checks.length;
        var pct = Math.round(ok / total * 100);
        var allOk = ok === total;

        res.innerHTML =
            '<div class="result-head">' +
                '<span class="result-score">' + ok + ' / ' + total + ' requisitos</span>' +
                '<div class="score-bar"><div class="score-fill" style="width:' + pct + '%"></div></div>' +
            '</div>' +
            '<ul>' + items + '</ul>' +
            '<p class="result-msg" style="color:' + (allOk ? '#15803d' : '#b45309') + ';">' +
                (allOk
                    ? '✅ ¡Excelente! Tu solución cumple todos los requisitos.'
                    : '🔎 Revisá los puntos marcados con ✘ y volvé a corregir.') +
            '</p>' +
            '<p style="font-size:.78rem;color:#64748b;margin:.4rem 0 0;">El corrector revisa la estructura del código (no ejecuta SQL).</p>';

        input.dataset.pct = pct;
        try { localStorage.setItem(CLAVE + id + '_pct', String(pct)); } catch (e) {}
        window.actualizarResumen();
    };

    window.limpiar = function (id) {
        var el = document.getElementById('in-' + id);
        var res = document.getElementById('res-' + id);
        if (el) { el.value = ''; delete el.dataset.pct; }
        if (res) { res.classList.remove('show'); res.innerHTML = ''; }
        try { localStorage.removeItem(CLAVE + id); localStorage.removeItem(CLAVE + id + '_pct'); } catch (e) {}
        window.actualizarResumen();
    };

    /* ================= PROGRESO ================= */
    window.actualizarResumen = function () {
        var lista = document.getElementById('progreso-lista');
        var barra = document.getElementById('progreso-barra');
        var texto = document.getElementById('progreso-texto');
        if (!lista) return;

        var completos = 0;
        var iniciados = 0;
        lista.innerHTML = TEMAS.map(function (t) {
            var el = document.getElementById('in-' + t.id);
            var valor = el ? el.value.trim() : '';
            var pct = el && el.dataset.pct !== undefined ? parseInt(el.dataset.pct, 10) : null;
            var clase, estado;
            if (pct === 100) {
                completos++;
                clase = 'done';
                estado = 'Completo';
            } else if (valor) {
                iniciados++;
                clase = 'progress';
                estado = pct !== null ? pct + ' %' : 'En progreso';
            } else {
                clase = 'todo';
                estado = 'Sin empezar';
            }
            return '<li><a href="#in-' + t.id + '">' + t.nombre + '</a>' +
                '<span class="pill ' + clase + '">' + estado + '</span></li>';
        }).join('');

        var pctGlobal = Math.round(completos / TEMAS.length * 100);
        if (barra) barra.style.width = pctGlobal + '%';
        if (texto) {
            texto.textContent = completos + ' de ' + TEMAS.length + ' completos' +
                (iniciados ? ' · ' + iniciados + ' en progreso' : '');
        }
    };

    window.reiniciarTodo = function () {
        if (!confirm('¿Borrar tus respuestas de los ejercicios de esta página?')) return;
        TEMAS.forEach(function (t) {
            var el = document.getElementById('in-' + t.id);
            var res = document.getElementById('res-' + t.id);
            if (el) { el.value = ''; delete el.dataset.pct; }
            if (res) { res.classList.remove('show'); res.innerHTML = ''; }
            try { localStorage.removeItem(CLAVE + t.id); localStorage.removeItem(CLAVE + t.id + '_pct'); } catch (e) {}
        });
        window.actualizarResumen();
    };

    /* ================= GUARDADO AUTOMÁTICO ================= */
    Object.keys(EJERCICIOS).forEach(function (id) {
        var el = document.getElementById('in-' + id);
        if (!el) return;
        try {
            var saved = localStorage.getItem(CLAVE + id);
            var savedPct = localStorage.getItem(CLAVE + id + '_pct');
            if (saved) el.value = saved;
            if (savedPct !== null) {
                el.dataset.pct = savedPct;
                if (saved) window.corregir(id);
            }
        } catch (e) {}
        el.addEventListener('input', function () {
            delete el.dataset.pct;
            try {
                localStorage.setItem(CLAVE + id, el.value);
                localStorage.removeItem(CLAVE + id + '_pct');
            } catch (e) {}
            window.actualizarResumen();
        });
    });

    window.actualizarResumen();
})();
