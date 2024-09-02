import fs from 'fs';
import plist from 'plist';

const library = plist.parse(fs.readFileSync('Library.xml').toString());

console.log(`${Object.keys(library['Tracks']).length} tracks`);

const tracks = Object.values(library['Tracks']);

const byName = new Map();

for (const track of tracks) {
    const name = track['Name'];
    if (!byName.has(name)) {
        byName.set(name, []);
    }
    const sameName = byName.get(name);
    if (!sameName.some(otherTrack => otherTrack['Artist'] === track['Artist'])) {
        sameName.push(track);
    }
}

const multiple = Array.from(byName.values()).filter(value => value.length > 1).map(songs => songs.map(({ Name, Artist }) => ({ Name, Artist }))); 

fs.writeFileSync('output.json', JSON.stringify(multiple, null, 2))