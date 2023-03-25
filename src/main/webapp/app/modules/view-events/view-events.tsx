import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IEvent } from 'app/shared/model/event.model';
import { getEntities } from 'app/entities/event/event.reducer';

export const ViewEvent = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const eventList = useAppSelector(state => state.event.entities);
  const loading = useAppSelector(state => state.event.loading);
  const totalItems = useAppSelector(state => state.event.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <div>
      <h2 id="event-heading" data-cy="EventHeading">
        z{/*<Translate contentKey="teamprojectApp.event.home.title">Events</Translate>*/}
        <div className="text-center">
          <Translate contentKey="teamprojectApp.event.home.title">Events</Translate>
        </div>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="teamprojectApp.event.home.refreshListLabel">Refresh List</Translate>
          </Button>
          {/*<Link to="/event/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="teamprojectApp.event.home.createLabel">Create new Event</Translate>
          </Link>
          */}
        </div>
      </h2>
      <div className="table-responsive">
        {eventList && eventList.length > 0 ? (
          <Table responsive>
            {/*
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="teamprojectApp.event.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>

                <th className="hand" onClick={sort('name')}>
                  <Translate contentKey="teamprojectApp.event.name">Name</Translate> <FontAwesomeIcon icon="sort"/>
                </th>
                <th className="hand" onClick={sort('date')}>
                  <Translate contentKey="teamprojectApp.event.date">Date</Translate> <FontAwesomeIcon icon="sort"/>
                </th>
                <th className="hand" onClick={sort('location')}>
                  <Translate contentKey="teamprojectApp.event.location">Location</Translate> <FontAwesomeIcon
                  icon="sort"/>
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="teamprojectApp.event.description">Description</Translate> <FontAwesomeIcon
                  icon="sort"/>
                </th>
                <th/>
                */}

            {eventList.map((event, i) => (
              <div key={`entity-${i}`} data-cy="entityTable">
                {/*<td>
                    <Button tag={Link} to={`/event/${event.id}`} color="link" size="sm">
                      {event.id}
                    </Button>
                  </td>
                  <td>{event.name}</td>
                  <td>{event.date ? <TextFormat type="date" value={event.date} format={APP_DATE_FORMAT}/> : null}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  */}

                <div className="card text-center">
                  <div className="card-header">{event.name}</div>
                  <div className="card-body">
                    <h5 className="card-title">Special title treatment</h5>
                    <p className="card-text">{event.description}</p>
                    <Button tag={Link} to={`/event/${event.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                      <FontAwesomeIcon icon="eye" />{' '}
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.view">View</Translate>
                      </span>
                    </Button>
                  </div>
                  <div className="card-footer text-muted">
                    {event.date ? <TextFormat type="date" value={event.date} format={APP_DATE_FORMAT} /> : null}
                  </div>
                </div>

                {/*<div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/event/${event.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye"/>{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                    </div>
                    */}

                {/*<Button
                          tag={Link}
                          to={`/event/${event.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        */}
                {/*<Button
                          tag={Link}
                          to={`/event/${event.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      */}
                {/*<td className="text-end">
                  </td>
                  */}
              </div>
            ))}
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="teamprojectApp.event.home.notFound">No Events found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={eventList && eventList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default ViewEvent;
