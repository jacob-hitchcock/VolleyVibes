import React from 'react';
import { VerticalTimeline,VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolleyballBall,faTrophy,faChartLine,faFire,faUsers,faTimesCircle,faThumbsUp,faFistRaised } from '@fortawesome/free-solid-svg-icons';

const Timeline = ({ milestones }) => {
    const getIcon = (milestone) => {
        if(milestone.description.includes('Games Played')) {
            return <FontAwesomeIcon icon={faVolleyballBall} style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('Wins')) {
            return <FontAwesomeIcon icon={faTrophy} className="icon-color" style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('VWAR')) {
            return <FontAwesomeIcon icon={faChartLine} className="icon-color" style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('Streak')) {
            return <FontAwesomeIcon icon={faFire} className="icon-color" style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('Game Together')) {
            return <FontAwesomeIcon icon={faUsers} style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('Lost Together')) {
            return <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('Won Together')) {
            return <FontAwesomeIcon icon={faThumbsUp} style={{ color: '#fff5d6' }} />;
        } else if(milestone.description.includes('Defeated')) {
            return <FontAwesomeIcon icon={faFistRaised} style={{ color: '#fff5d6' }} />;
        }
        // Add other icons for different milestones as needed
        return null;
    };

    return (
        <VerticalTimeline>
            {milestones.map((milestone,index) => {
                return (
                    <VerticalTimelineElement
                        key={index}
                        date={milestone.date}
                        iconStyle={{ background: '#e7552b',color: '#fff' }}
                        icon={getIcon(milestone)}
                        className="timeline-element"
                    >
                        <div className="milestone-card">
                            <h3 className="vertical-timeline-element-title" style={{ color: '#e7552b',fontSize: '22px' }}>{milestone.title}</h3>
                            <p style={{ fontSize: '16px' }}>{milestone.description}</p>
                        </div>
                    </VerticalTimelineElement>
                );
            })}
        </VerticalTimeline>
    );
};

export default Timeline;
