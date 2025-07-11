import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";
import CharacterSearchInput from "../components/CharacterSearchInput";
import CharacterProfileCard from "../components/CharacterProfileCard";
import GemList from "../components/Gem/GemList";
import EquipmentAccessoryRow from "../components/Equipment/EquipmentAccessoryRow";
import ScoreRow from "../components/score/ScoreRow";


export default function CharacterSearchPage() {
  const { name: characterName } = useParams();
  const [characterData, setCharacterData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favoriteHistory");
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

useEffect(() => {
  const fetchCharacter = async () => {
    if (!characterName) return;
    setIsLoading(true);
    try {
      const encodedName = encodeURIComponent(characterName); 
      const response = await axios.get(`/api/character/${encodedName}`);
      if (response.data?.profile) {
        setCharacterData(response.data);
      } else {
        setCharacterData(null);
      }
    } catch (err) {
      console.error(err);
      setCharacterData(null);
    }
    setHasSearched(true);
    setIsLoading(false);
  };

  fetchCharacter();
}, [characterName]);


  const handleFavoriteToggle = (name, isNowFavorite) => {
    const updated = isNowFavorite
      ? [name, ...favorites.filter((n) => n !== name)]
      : favorites.filter((n) => n !== name);
    localStorage.setItem("favoriteHistory", JSON.stringify(updated));
    setFavorites(updated);
  };

  const engravings = characterData?.profile?.engravings || [];

  const gears =
    characterData?.equipments?.filter((item) =>
      ["무기", "투구", "상의", "하의", "장갑", "어깨"].includes(item.Type)
    ) || [];

  const accessories =
    characterData?.equipments?.filter((item) =>
      ["목걸이", "귀걸이", "반지"].includes(item.Type)
    ) || [];

  const abilityStone = characterData?.equipments?.find((item) => item.Type === "어빌리티 스톤");
  const bracelet = characterData?.equipments?.find((item) => item.Type === "팔찌");
  const maxLen = 7;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-6">







      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">잠시만 기다려주세요</p>
      ) : hasSearched && characterData ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            {characterData.profile.CharacterName} 님의 캐릭터 정보
          </h1>

          <div className="flex flex-col items-center">
            <div className="flex w-full max-w-[1280px] gap-6">
              <div className="min-w-[260px] max-w-[260px] bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow">
                <CharacterProfileCard
                  key={characterData.profile.CharacterName} // ★ 변경되면 다시 그려짐
                  profile={characterData.profile}
                  favorites={favorites}
                  onFavoriteToggle={handleFavoriteToggle}
                />

                <ScoreRow
                  items={gears}
                  accessories={accessories}
                  engravings={engravings}
                  abilityStone={abilityStone}
                  bracelet={bracelet}
                  gems={characterData.gems}
                />

              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">보석</h2>
                      <Link
                        to={`/character/simulation/${characterName}`}
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        시뮬레이션으로 이동
                      </Link>

                    </div>

                    <GemList gems={characterData.gems} layout="inline" />
                  </div>

                  <div className="mt-6">
                    <div className="grid grid-cols-2 mb-2">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">장비</h2>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">악세서리</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                      {Array.from({ length: maxLen }).map((_, i) => (
                        <EquipmentAccessoryRow
                          key={i}
                          equipment={gears[i] || null}
                          accessory={accessories[i] || null}
                          abilityStone={i === maxLen - 2 ? abilityStone : null}
                          bracelet={i === maxLen - 1 ? bracelet : null}
                          engravings={i === maxLen - 1 ? engravings : null}

                        />
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : hasSearched ? (
        <p className="text-center text-red-500 dark:text-red-400">해당 유저가 존재하지 않습니다.</p>
      ) : null}
    </div>
  );
}
