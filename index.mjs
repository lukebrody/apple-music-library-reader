import fs from 'fs';
import plist from 'plist';

const library = plist.parse(fs.readFileSync('Library.xml').toString());

console.log(`${Object.keys(library['Tracks']).length} tracks`);

const tracks = Object.values(library['Tracks']);

const byName = new Map();

for (const track of tracks) {
    const nameKey = track['Name'].replaceAll(/\(.*\)/g, '').trim();
    if (!byName.has(nameKey)) {
        byName.set(nameKey, []);
    }
    const sameName = byName.get(nameKey);
    if (!sameName.some(otherTrack => otherTrack['Artist'] === track['Artist'])) {
        sameName.push(track);
    }
}

const multiple = Array.from(byName.values())
    .filter(value => value.length > 1)
    .map(songs => 
        songs
        .map(({ Name, Artist, 'Play Count': playCount }) => ({ Name, Artist, 'Play Count': playCount ?? 0 }))
        .sort((a, b) => b['Play Count'] - a['Play Count'])
    );

console.log(`${multiple.length} Sets of duplicates`);

const averageOfTopTwo = (sortedSongs) => (sortedSongs[0]['Play Count'] + sortedSongs[1]['Play Count']) / 2

multiple.sort((set1, set2) => averageOfTopTwo(set2) - averageOfTopTwo(set1))

fs.writeFileSync('output.json', JSON.stringify(multiple, null, 2))