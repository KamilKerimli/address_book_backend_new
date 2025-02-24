import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPhoneCodes = (req, res) => {
    try {
        const filePath = path.join(__dirname, '../datas/phoneCode.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err); 
                return res.status(500).json({ message: 'Server error', error: err.message });
            }

            try {
                const phoneCodes = JSON.parse(data);
                res.status(200).json(phoneCodes);
            } catch (parseError) {
                console.error(parseError);
                res.status(500).json({ message: 'Invalid JSON format', error: parseError.message });
            }
        });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export { getPhoneCodes };
