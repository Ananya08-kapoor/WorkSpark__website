import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function load() {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; }
  });
  const w = dom.window;
  const doc = w.document;
  const as = (role) => { w.eval(`go('${role}', {seeker:'search',employer:'post',admin:'appr'}['${role}'])`); };
  const cards = () => [...doc.querySelectorAll('#res > .card')];
  const click = (text) => [...doc.querySelectorAll('button')].find(b => b.textContent.trim() === text).click();
  return { w, doc, as, cards, click };
}

test('login screen renders with the three roles', () => {
  const { doc } = load();
  assert.match(doc.body.textContent, /WorkSpark/);
  assert.equal(doc.querySelectorAll('input[name=r]').length, 3);
});

test('job search is paginated: 5 per page, 8 approved jobs -> 2 pages', () => {
  const { doc, as, cards, click } = load();
  as('seeker');
  assert.equal(cards().length, 5); // pager is a <nav>, not a .card
  assert.match(doc.querySelector('nav[aria-label=Pagination]').textContent, /Page 1 of 2/);
  assert.ok([...doc.querySelectorAll('button')].find(b => b.textContent === 'Previous').disabled);
  click('Next');
  assert.equal(cards().length, 3);
  assert.match(doc.querySelector('nav[aria-label=Pagination]').textContent, /Page 2 of 2/);
  assert.ok([...doc.querySelectorAll('button')].find(b => b.textContent === 'Next').disabled);
});

test('changing a filter resets to page 1 and hides the pager when results fit', () => {
  const { w, doc, as, cards, click } = load();
  as('seeker');
  click('Next');
  const k = doc.querySelector('#k');
  k.value = 'java';
  k.dispatchEvent(new w.Event('input'));
  assert.equal(cards().length, 1);
  assert.equal(doc.querySelector('nav[aria-label=Pagination]'), null);
});

test('only approved jobs are visible to job seekers', () => {
  const { w, doc, as } = load();
  as('seeker');
  const total = w.eval("jobs.filter(j=>j.status=='approved').length");
  assert.equal(total, 8);
  assert.ok(!doc.querySelector('#app').textContent.includes('DevOps Engineer'));
  assert.ok(!doc.querySelector('#app').textContent.includes('UI/UX Designer'));
});

test('applying twice does not create a duplicate application', () => {
  const { w, as } = load();
  as('seeker');
  w.eval('apply(1)');
  w.eval('apply(1)');
  assert.equal(w.eval('apps.filter(a=>a.mine&&a.jobId==1).length'), 1);
});

test('admin approval publishes a pending job', () => {
  const { w, as } = load();
  as('admin');
  w.eval('selP=5;render()');
  w.eval("document.querySelector('#rm').value='Looks good'");
  w.eval('decide(true)');
  assert.equal(w.eval('jobs.find(j=>j.id==5).status'), 'approved');
});

test('rejecting without remarks is blocked', () => {
  const { w, doc, as } = load();
  as('admin');
  w.eval('selP=5;render()');
  w.eval('decide(false)');
  assert.equal(w.eval('jobs.find(j=>j.id==5).status'), 'pending');
  assert.match(doc.querySelector('#toast').textContent, /remarks/i);
});

test('user-supplied text is HTML-escaped (no script injection)', () => {
  const { w, doc, as } = load();
  as('employer');
  doc.querySelector('#pt').value = '<img src=x onerror=alert(1)>';
  doc.querySelector('#pm').value = '<b>desc</b>';
  w.eval('postJob()');
  assert.equal(doc.querySelectorAll('img').length, 0);
  assert.match(doc.body.innerHTML, /&lt;img src=x/);
});

test('employer status update is stored', () => {
  const { w, doc, as } = load();
  as('employer');
  w.eval("go('employer','jobs')");
  doc.querySelector('#s3').value = 'Interview';
  w.eval('upd(3)');
  assert.equal(w.eval('apps.find(a=>a.id==3).status'), 'Interview');
});
