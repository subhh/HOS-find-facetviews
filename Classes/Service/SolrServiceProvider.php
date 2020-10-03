<?php
namespace Subhh\Hosfindfacetviews\Service;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 3
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

class SolrServiceProvider extends \Subugoe\Find\Service\SolrServiceProvider
{
    public function getDocumentById (string $id)
    {
        $this->requestArguments['qualifikationsarbeit'] = 1;
        return parent::getDocumentById($id);
    }

    /**
     * Creates a blank query, sets up TypoScript filters and adds it to the view.
     *
     */
    protected function createQuery()
    {
        parent::createQuery();
        $this->addMainQueryOperator();
        if ($this->requestArguments['qualifikationsarbeit'] != '1') {
            $this
                ->query
                ->createFilterQuery('qualifikationsarbeit')
                ->setQuery('internal_qualifikationsarbeit:false');
        }
    }

    /*
     * Set configured main query operator. Defaults to 'AND'.
     */
    protected function addMainQueryOperator() {
        $mainQueryOperator = 'AND';
        if (isset($this->settings['mainQueryOperator'])) {
            $mainQueryOperator = $this->settings['mainQueryOperator'];
        }

        $this->query->setQueryDefaultOperator($mainQueryOperator);
    }

}
