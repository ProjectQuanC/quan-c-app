import { exec } from 'child_process';
import { promisify } from 'util';
import CustomError from './error.utils';
import { open, Entry } from 'yauzl';
import fs, { createWriteStream, mkdir, readFileSync } from 'fs';
import path, { dirname, join } from 'path';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const execAsync = promisify(exec);

function getPassedTestCaseList(maxValue: number, decimalNumber: number): number[] {
    const numberArray: number[] = [];
    for (let i = 0; i < maxValue; i++) {
        if (decimalNumber & (1 << i)) {
            numberArray.push(i + 1);
        }
    }
    return numberArray;
}

const insertTags = async (tags: string[], challengeId: string) => {
    tags.forEach(async (tag: string) => {
        const tagFormat = tag.toUpperCase();
        const searchTag = await prisma.Tag.findFirst({
            where: {
                tag_name: tagFormat,
            }
        });

        if (!searchTag) {
            const newTag = await prisma.Tag.create({
                data: {
                    tag_name: tagFormat,
                }
            });
            await prisma.TagAssign.create({
                data: {
                    challenge_id: challengeId,
                    tag_id: newTag.tag_id,
                }
            });
        }
        else {
            const tagId = searchTag.tag_id;
            await prisma.TagAssign.create({
                data: {
                    challenge_id: challengeId,
                    tag_id: tagId,
                }
            });
        }
    });
}

const updateTags = async (tags: string[], challengeId: string) => {
    const oldTags = await prisma.TagAssign.findMany({
        where: {
            challenge_id: challengeId,
        }
    });

    oldTags.forEach(async(tagAssign: any) => {
        await prisma.TagAssign.delete({
            where: {
                tag_assign_id: tagAssign.tag_assign_id,
            }
        });
    });

    await insertTags(tags, challengeId);
}

function extractZip(filePath: string, unzipPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        open(filePath, { lazyEntries: true }, (err, zipfile) => {
            if (err) return reject(new CustomError('Failed to open zip file'));

            zipfile.on('entry', (entry: Entry) => {
                const fileName: string = entry.fileName;
                const entryPath: string = join(unzipPath, fileName);

                if (/\/$/.test(fileName)) {
                    // Directory entry
                    mkdir(entryPath, { recursive: true }, (err) => {
                        if (err) return reject(new CustomError('Failed to create directory'));
                        zipfile.readEntry();
                    });
                } else {
                    // File entry
                    const dirPath: string = dirname(entryPath);
                    mkdir(dirPath, { recursive: true }, (err) => {
                        if (err) return reject(new CustomError('Failed to create directory'));

                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) return reject(new CustomError('Failed to read zip entry'));

                            const writeStream = createWriteStream(entryPath);
                            readStream.pipe(writeStream);

                            readStream.on('end', () => {
                                zipfile.readEntry();
                            });

                            writeStream.on('error', () => {
                                return reject(new CustomError('Failed to write file'));
                            });
                        });
                    });
                }
            });

            zipfile.on('end', resolve);
            zipfile.on('error', () => reject(new CustomError('Failed during zip extraction')));
            zipfile.readEntry();
        });
    });
}



async function executeRunFileCommands(runFilePath: string): Promise<void> {
    try {
        // Resolve the directory of run.txt
        const runDirectory = path.dirname(runFilePath);

        // Read the contents of run.txt
        const runCommands = await fs.promises.readFile(runFilePath, 'utf-8');

        // Split the commands by newline character
        const commands = runCommands.split('\n');

        // Execute each command asynchronously
        for (const command of commands) {
            // Execute the command asynchronously
            try {
                // Change the working directory before executing the command
                const options = { cwd: runDirectory };
                await execAsync(command, options);
            } catch (error) {
                console.error(`Error executing command: ${command}`, error);
                throw new CustomError(`Error executing command: ${command}`);
            }
        }
    } catch (error) {
        console.error('Error executing commands from run.txt:', error);
        throw new CustomError('Error executing commands from run.txt');
    }
}

const deleteChallengeFolder = async (challengeId: string) => {
    const challengeFolder = path.join(__dirname, `../../../quan-c-runner/challenges/${challengeId}`);
    try {
        await fs.promises.rm(challengeFolder, { recursive: true });
    } 
    catch (error) {
        // console.error('Error deleting challenge folder:', error);
        return
    }
}

export {
    delay,
    execAsync,
    getPassedTestCaseList,
    insertTags,
    extractZip,
    executeRunFileCommands,
    updateTags,
    deleteChallengeFolder
}