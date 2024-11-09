import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export type MyDispatch = typeof useAppDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
