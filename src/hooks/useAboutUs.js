import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { aboutPublicInfoRequest } from '../redux/actions/aboutActions';

export const useAboutUs = () => {
    const dispatch = useDispatch();
    const { publicData: aboutData, publicLoading } = useSelector((state) => state.about || {});

    useEffect(() => {
        // Chỉ load nếu chưa có dữ liệu và không đang loading
        if (!aboutData && !publicLoading) {
            dispatch(aboutPublicInfoRequest());
        }
    }, [dispatch, aboutData, publicLoading]);

    return {
        aboutData,
        loading: publicLoading
    };
};
