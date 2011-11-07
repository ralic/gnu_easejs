/**
 * Tests member builder validation rules
 *
 *  Copyright (C) 2010 Mike Gerwitz
 *
 *  This file is part of ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify it under the
 *  terms of the GNU Lesser General Public License as published by the Free
 *  Software Foundation, either version 3 of the License, or (at your option)
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 *  for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author  Mike Gerwitz
 * @package test
 */

var shared = require( __dirname + '/inc-common' );


require( 'common' ).testCase(
{
    caseSetUp: function()
    {
        var _self = this;

        this.quickFailureTest = shared.quickFailureTest;

        this.quickKeywordPropTest = function( keywords, identifier, prev )
        {
            shared.quickKeywordTest.call( this,
                'validateProperty', keywords, identifier, prev
            );
        };

        this.quickVisChangeTest = function( start, override, failtest )
        {
            shared.quickVisChangeTest.call( _self, start, override, failtest,
                function( name, startobj, overrideobj )
                {
                    _self.sut.validateProperty(
                        name, 'bar', overrideobj,
                        { member: 'foo' },
                        startobj
                    );
                }
            );
        };
    },


    setUp: function()
    {
        this.sut = this.require( 'MemberBuilderValidator' )();
    },


    /**
     * Clearly, overriding a method with a property will have terrible
     * polymorphic consequences on the resulting interface.
     */
    'Cannot override method with property': function()
    {
        var name  = 'foo',
            _self = this;

        this.quickFailureTest( name, 'property', function()
        {
            // attempt to override a method
            _self.sut.validateProperty(
                name, 'bar', {},
                { member: function() {} },
                {}
            );
        } );
    },


    /**
     * The concept of an abstract property does not make sense, as properties
     * simply represent placeholders for values. Whether or not they actually
     * hold a value is irrelevant.
     */
    'Cannot declare abstract property': function()
    {
        this.quickKeywordPropTest( [ 'abstract' ], 'abstract' );
    },


    /**
     * Properties, unlike methods, are virtual by default. If a property's value
     * can be reassigned, why would a subclass not be able to reassign it? If
     * one wishes to prevent a property's value from changing, they should use
     * the visibility modifiers or declare the property as a constant.
     */
    'Cannot declare virtual property': function()
    {
        this.quickKeywordPropTest( [ 'virtual' ], 'virtual' );
    },


    /**
     * Declaring a constant as static would be redundant.
     */
    'Cannot declare static const property': function()
    {
        this.quickKeywordPropTest( [ 'static', 'const' ], 'Static' );
    },


    /*
     * While getters act as properties, it doesn't make sense to override
     * getters/setters with properties because they are fundamentally different.
     */
    'Cannot override getter/setter with property': function()
    {
        var name  = 'foo',
            _self = this;

        // test getter
        this.quickFailureTest( name, 'getter/setter', function()
        {
            _self.sut.validateProperty(
                name, 'bar', {},
                { get: function() {} },
                {}
            );
        } );

        // test setter
        this.quickFailureTest( name, 'getter/setter', function()
        {
            _self.sut.validateProperty(
                name, 'bar', {},
                { set: function() {} },
                {}
            );
        } );
    },


    /**
     * De-escalating the visibility of a property would alter the interface of a
     * subtype, which would not be polymorphic.
     */
    'Properties do not support visibility de-escalation': function()
    {
        this.quickVisChangeTest( 'public', 'protected', true );
        this.quickVisChangeTest( 'protected', 'private', true );
    },


    /**
     * Contrary to the above test, we have no such problem with visibility
     * escalation.
     */
    'Properties do support visibility escalation and equality': function()
    {
        var _self = this;
        shared.visEscalationTest( function( cur )
        {
            _self.quickVisChangeTest( cur[ 0 ], cur[ 1 ], false );
        } );
    },
} );
