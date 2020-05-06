const baseDamage = document.querySelector('#base-damage');
const multMod = document.querySelector('#mult-mod');
const linMod = document.querySelector('#lin-mod');
const critMod = document.querySelector('#crit-mod');
const critDamage = document.querySelector('#crit-damage');
const numberOfIterations = document.querySelector('#it');

const button = document.querySelector('#button');
const resultEl = document.querySelector('#result');

const calculateDice = (value) => {
  if (!Number(value)) {
    const first = value.split('d');
    const second = first[1].split('+');
    const dices = [Number(first[0]), Number(second[0]), second[1] ? Number(second[1]) : 0]
    const result = Array.apply(null, { length: dices[0] }).reduce(
      total => total + Math.floor(Math.random() * dices[1]) + 1 + dices[2]
      , 0);
    return result;
  }
  return Number(value);
}

const calculateDamage = (bd, mm, lm, cm, cd) => {
  if (Math.floor(Math.random() * cm) + 1 === 1) {
    return {
      crit: 1,
      damage: (calculateDice(cd) * (1 + mm)) + lm,
    }
  }
  return {
    crit: 0,
    damage: (calculateDice(bd) * (1 + mm)) + lm,
  }
};

const calculateIterations = (bd, mm, lm, cm, cd, it) => {
  const a = Array.apply(null, { length: it }).map(
    () => calculateDamage(bd, mm, lm, cm, cd)
  );
  console.log(a);
  const result = a.reduce((total, t) => {

    const newTotal = {
      avgcritper: total.avgcritper + t.crit / it,
      avgdamage: total.avgdamage + t.damage / it,
      maxcrit: total.maxcrit,
      maxnormalhit: total.maxnormalhit,
      avgcrit: total.avgcrit,
      mincrit: total.mincrit,
      minnormalhit: total.minnormalhit,
    }

    if (t.crit) {
      newTotal.avgcrit = total.avgcrit + t.damage;
      if (total.maxcrit < t.damage) {
        newTotal.maxcrit = t.damage;
      }
      if (total.mincrit > t.damage) {
        newTotal.mincrit = t.damage;
      }
    } else {
      if (total.maxnormalhit < t.damage) {
        newTotal.maxnormalhit = t.damage;
      }
      if (total.minnormalhit > t.damage) {
        newTotal.minnormalhit = t.damage;
      }
    }

    return newTotal;
  }, {
    avgcritper: 0,
    avgdamage: 0,
    maxcrit: 0,
    maxnormalhit: 0,
    avgcrit: 0,
    mincrit: Number.MAX_SAFE_INTEGER,
    minnormalhit: Number.MAX_SAFE_INTEGER,
  })


  console.log({
    avgcritper: Math.round(result.avgcritper*100) + '%',
    avgdamage: Math.round(result.avgdamage),
    maxcrit: result.maxcrit,
    maxnormalhit: result.maxnormalhit,
    avgcrit: Math.round(result.avgcrit / (result.avgcritper * it)),
    mincrit: result.mincrit,
    minnormalhit: result.minnormalhit,
  });
  return {
    avgcritper: Math.round(result.avgcritper*100) + '%',
    avgdamage: Math.round(result.avgdamage),
    maxcrit: result.maxcrit,
    maxnormalhit: result.maxnormalhit,
    avgcrit: Math.round(result.avgcrit / (result.avgcritper * it)),
    mincrit: result.mincrit,
    minnormalhit: result.minnormalhit,
  };
}


button.onclick = () => {
  const result = calculateIterations(
    baseDamage.value,
    Number(multMod.value),
    Number(linMod.value),
    Number(critMod.value),
    critDamage.value,
    Number(numberOfIterations.value),
  );
  resultEl.textContent = JSON.stringify(result);
}

