import { describe, expect, it, vi } from 'vitest';
import { SoundboardChannel } from '../SoundboardChannel';

interface AudioStub
{
    pause: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    load: ReturnType<typeof vi.fn>;
    removeAttribute: ReturnType<typeof vi.fn>;
    volume: number;
    currentTime: number;
}

const createAudioStub = (): AudioStub => ({
    pause: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
    load: vi.fn(),
    removeAttribute: vi.fn(),
    volume: 0,
    currentTime: 9
});

describe('SoundboardChannel', () =>
{
    it('rejects unsafe schemes without creating an audio element', async () =>
    {
        const factory = vi.fn();
        const channel = new SoundboardChannel(factory as any);

        await expect(channel.play('javascript:alert(1)', 0.8)).resolves.toBe(false);
        expect(factory).not.toHaveBeenCalled();
    });

    it('replaces the current sound and fully unloads the previous element', async () =>
    {
        const first = createAudioStub();
        const second = createAudioStub();
        const factory = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second);
        const channel = new SoundboardChannel(factory as any);

        await expect(channel.play('/sounds/first.mp3', 0.8)).resolves.toBe(true);
        await expect(channel.play('https://cdn.example/second.mp3', 0.4)).resolves.toBe(true);

        expect(first.pause).toHaveBeenCalledOnce();
        expect(first.currentTime).toBe(0);
        expect(first.removeAttribute).toHaveBeenCalledWith('src');
        expect(first.load).toHaveBeenCalledOnce();
        expect(second.volume).toBe(0.4);
    });

    it('updates the active volume and cleans up a rejected play', async () =>
    {
        const audio = createAudioStub();
        audio.play.mockRejectedValueOnce(new Error('autoplay blocked'));
        const channel = new SoundboardChannel(() => audio as unknown as HTMLAudioElement);

        await expect(channel.play('/sounds/blocked.mp3', 0.8)).resolves.toBe(false);
        expect(audio.pause).toHaveBeenCalledOnce();
        expect(audio.removeAttribute).toHaveBeenCalledWith('src');

        const active = createAudioStub();
        const activeChannel = new SoundboardChannel(() => active as unknown as HTMLAudioElement);
        await activeChannel.play('/sounds/active.mp3', 0.8);
        activeChannel.setVolume(0.25);
        expect(active.volume).toBe(0.25);
    });
});
