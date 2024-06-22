import React from 'react';
import { VerticalTimeline,VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolleyballBall,faTrophy,faChartLine } from '@fortawesome/free-solid-svg-icons';

const Timeline = ({ milestones }) => {
    const getIcon = (milestone) => {
        if(milestone.title.includes('Games Played')) {
            return <FontAwesomeIcon icon={faVolleyballBall} style={{ color: '#fff5d6' }} />;
        } else if(milestone.title.includes('Wins')) {
            return <FontAwesomeIcon icon={faTrophy} className="icon-color" style={{ color: '#fff5d6' }} />;
        } else if(milestone.title.includes('VWAR')) {
            return <FontAwesomeIcon icon={faChartLine} className="icon-color" style={{ color: '#fff5d6' }} />;
        }
        // Add other icons for different milestones as needed
        return null;
    };
    return (
        <VerticalTimeline>
            {milestones.map((milestone,index) => (
                <VerticalTimelineElement
                    key={index}
                    date={milestone.date}
                    iconStyle={{ background: '#e7552b',color: '#fff' }}
                    icon={getIcon(milestone)}
                >
                    <h3 className="vertical-timeline-element-title" style={{ color: 'black' }}>{milestone.title}</h3>
                </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
    );
};

export default Timeline;
