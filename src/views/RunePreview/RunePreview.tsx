import s from './style.module.scss';

import { useCallback, useMemo } from 'react';
import { Button, Card } from '@nextui-org/react';

import { PerkPage, Rune, RuneSlot } from '../../interfaces';
import { IconSword } from '@tabler/icons';
import { invoke } from '@tauri-apps/api';

interface RRune extends Rune {
  parent?: number;
}

export function RunePreview({perks, runesReforged}: { perks: PerkPage[], runesReforged: RuneSlot[] }) {
  const getSlots = useCallback((perk: PerkPage) => {
    let primary = runesReforged.find(i => i.id === perk.primaryStyleId);
    let sub = runesReforged.find(i => i.id === perk.subStyleId);

    return {
      primary,
      sub
    };
  }, [runesReforged]);

  const applyPerk = useCallback((p: PerkPage) => {
    invoke('apply_perk', {perk: JSON.stringify(p)});
  }, []);

  let runesRef = useMemo(() => {
    let r: { [key: number]: RRune } = {};
    runesReforged.forEach(i => {
      i.slots.forEach(j => {
        j.runes.forEach(k => {
          r[k.id] = {
            ...k,
            parent: i.id
          };
        });
      });
    });

    return r;
  }, [runesReforged]);

  return (
    <Card css={{width: '80vw'}}>
      {
        perks.map((p, idx) => {
          let {primary, sub} = getSlots(p);

          return (
            <div className={s.item} key={idx}>
              <img
                width={36}
                height={36}
                key={primary.key}
                src={`https://ddragon.leagueoflegends.com/cdn/img/${primary.icon}`}
                alt={primary.name}
              />
              {p.selectedPerkIds
              .filter(i => runesRef[i]?.parent === primary.id)
              .map(i => {
                let rune = runesRef[i];
                return (
                  <img
                    width={24}
                    height={24}
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${runesRef[i].icon}`}
                    alt={runesRef[i].name}
                  />
                );
              })}

              <img key={sub.key} src={`https://ddragon.leagueoflegends.com/cdn/img/${sub.icon}`} alt={sub.name}/>
              {p.selectedPerkIds
              .filter(i => runesRef[i]?.parent === sub.id)
              .map(i => {
                let rune = runesRef[i];
                return (
                  <img
                    width={24}
                    height={24}
                    src={`https://ddragon.leagueoflegends.com/cdn/img/${runesRef[i].icon}`}
                    alt={runesRef[i].name}
                  />
                );
              })}

              <Button
                auto
                flat
                color="success"
                icon={<IconSword/>}
                css={{marginLeft: '2rem'}}
                onClick={() => applyPerk(p)}
              />
            </div>
          );
        })
      }
    </Card>
  );
}