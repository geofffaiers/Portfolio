'use client';

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSidebar } from '@/components/ui/sidebar';

import { Bubble } from './bubble';

type UseReactions = {
    componentRef: RefObject<HTMLDivElement | null>
    canvasRef: RefObject<HTMLCanvasElement | null>
    playing: boolean
    displayGame: boolean
    counter: number
    score: number
    timeLeft: number
    animateScore: boolean
    newGame: () => void
}

type Dimensions = {
    left: number
    top: number
    width: number
    height: number
}

export const DEFAULT_TIME: number = 15;

export const useReactions = (): UseReactions => {
    const { state } = useSidebar();
    const [dimensions, setDimensions] = useState<Dimensions>({ left: 0, top: 0, width: 0, height: 0 });
    const [density, setDensity] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [animateScore, setAnimateScore] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const previousSideBarStateRef = useRef<'expanded' | 'collapsed'>(state);
    const bubblesRef = useRef<Bubble[]>([]);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const displayGame: boolean = useMemo(() => playing || score === 0, [playing, score]);

    const createBubble = useCallback(() => {
        const size = Math.random() * 20 + 10;
        const topPosition = Math.random() * dimensions.height;
        const leftPosition = Math.random() * dimensions.width;
        const topMovement = (Math.random() - 0.5) * 2;
        const leftMovement = (Math.random() - 0.5) * 2;
        bubblesRef.current.push(
            new Bubble(
                topPosition,
                leftPosition,
                topMovement,
                leftMovement,
                size
            )
        );
    }, [dimensions]);

    const createBubbles = useCallback(() => {
        for (let i = 0; i < density; i++) {
            createBubble();
        }
    }, [createBubble, density]);

    const newGame = useCallback(() => {
        setScore(0);
        bubblesRef.current = [];
        createBubbles();
    }, [createBubbles]);

    const animate = useCallback((currentTime: number, ctx: CanvasRenderingContext2D): void => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        bubblesRef.current = bubblesRef.current.filter(bubble => {
            bubble.update(dimensions.width, dimensions.height);
            bubble.draw(ctx, currentTime);
            return !bubble.popped || (bubble.popStartTime !== null && currentTime - bubble.popStartTime < 300);
        });
        animationFrameRef.current = requestAnimationFrame((currentTime: number) => animate(currentTime, ctx));
    }, [dimensions]);

    useEffect(() => {
        const component = componentRef.current;
        if (component == null) return;
        const canvas = canvasRef.current;
        if (canvas == null) return;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (ctx == null) return;

        const resizeCanvas = (): void => {
            previousSideBarStateRef.current = state;
            const fullWidth = window.innerWidth;
            const fullHeight = window.innerHeight;
            const width = component.offsetWidth;
            const height = component.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            setDimensions({
                top: fullHeight - height,
                left: fullWidth - width,
                width,
                height,
            });
            setDensity(Math.floor((width * height) / 50000));
        };

        window.addEventListener('resize', resizeCanvas);
        if (
            state !== previousSideBarStateRef.current ||
            dimensions.width === 0 || dimensions.height === 0
        ) {
            setTimeout(resizeCanvas, 200);
        }
        if (bubblesRef.current.length === 0) {
            createBubbles();
        }
        animationFrameRef.current = requestAnimationFrame((currentTime: number) => animate(currentTime, ctx));
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current != null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [animate, createBubbles, newGame, dimensions, state]);

    const handleMove = useCallback((event: Partial<MouseEvent | Touch>): void => {
        const { clientX, clientY } = event;
        const { left, top } = dimensions;
        const mouseTop = (clientY ?? 0) - top;
        const mouseLeft = (clientX ?? 0) - left;
        for (let i = 0; i < bubblesRef.current.length; i++) {
            const bubble = bubblesRef.current[i];
            if (!bubble.popped && bubble.isCursorOver(mouseLeft, mouseTop)) {
                bubble.pop();
                if (!playing) {
                    setCounter(prevCounter => prevCounter + 1);
                    setPlaying(true);
                }
                setScore(prevScore => prevScore + 1);
                setAnimateScore(true);
                setTimeout(() => setAnimateScore(false), 300);
                createBubble();
                break;
            }
        }
    }, [dimensions, playing, setPlaying, setScore, setAnimateScore, createBubble]);

    const handleTouch = useCallback((event: TouchEvent): void => {
        event.preventDefault();
        const touch = event.touches[0];
        if (touch) {
            handleMove({
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
        }
    }, [handleMove]);

    useEffect(() => {
        if (!playing) {
            return;
        } else {
            setTimeLeft(DEFAULT_TIME);
        }

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft => {
                if (timeLeft < 1) {
                    bubblesRef.current = [];
                    clearInterval(timerId);
                    setPlaying(false);
                    return 0;
                }
                return timeLeft - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timerId);
            setPlaying(false);
        };
    }, [playing]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchstart', handleTouch);

        return () => {
            canvas.removeEventListener('mousemove', handleMove);
            canvas.removeEventListener('touchmove', handleTouch);
            canvas.removeEventListener('touchstart', handleTouch);
        };
    }, [handleMove, handleTouch]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (bubblesRef.current.length < density && displayGame) {
                createBubble();
            }
        }, Math.min(9000 / density, 1000));

        return () => {
            clearInterval(intervalId);
        };
    }, [density, createBubble, displayGame]);

    return {
        componentRef,
        canvasRef,
        playing,
        displayGame,
        counter,
        score,
        timeLeft,
        animateScore,
        newGame,
    };
};
